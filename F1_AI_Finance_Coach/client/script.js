const API = "http://localhost:3000/api";

let user = JSON.parse(localStorage.getItem("smartSpendUser") || "null");
let userId = localStorage.getItem("smartSpendUserId");
let transactions = [];
let budgets = [];
let goals = [];
let categoryChart = null;
let monthlyChart = null;

const $ = id => document.getElementById(id);

function money(n) {
  return new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(Number(n || 0));
}
function fmtDate(d) { return new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); }
function escapeHtml(v) { return String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }

async function api(path, options={}) {
  const res = await fetch(`${API}${path}`, options);
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.message || "Server request failed");
  return data;
}

function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  setTimeout(()=>$("toast").classList.remove("show"),2500);
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));
  document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  const titles={dashboard:"Dashboard",transactions:"Transactions",budgets:"Budgets",goals:"Savings Goals",recurring:"Recurring",insights:"AI Coach"};
  $("pageTitle").textContent=titles[id] || "Dashboard";
  if(id==="recurring") loadInsights();
}

document.querySelectorAll(".nav").forEach(btn=>btn.addEventListener("click",()=>showPage(btn.dataset.page)));

async function startWorkspace() {
  if (user && userId) {
    setUser(user);
    await loadAll();
    return;
  }
  $("userModal").classList.add("show");
}

$("userForm").addEventListener("submit", async e=>{
  e.preventDefault();
  try {
    const data=await api("/users/register",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name:$("userInputName").value.trim(),email:$("userInputEmail").value.trim()})
    });
    setUser(data);
    $("userModal").classList.remove("show");
    toast("Workspace connected");
    await loadAll();
  } catch(err){ toast(err.message); }
});

function setUser(data){
  user=data; userId=data._id;
  localStorage.setItem("smartSpendUser",JSON.stringify(data));
  localStorage.setItem("smartSpendUserId",data._id);
  $("userName").textContent=data.name;
  $("userEmail").textContent=data.email;
  $("avatar").textContent=data.name.charAt(0).toUpperCase();
}

async function loadAll(){
  if(!userId)return;
  try{
    await Promise.all([loadTransactions(),loadBudgets(),loadGoals(),loadInsights()]);
  }catch(err){toast(err.message);}
}

async function loadTransactions(){
  transactions=await api(`/transactions?userId=${encodeURIComponent(userId)}`);
  updateStats(); renderRecent(); renderTransactions(); renderCategoryChart();
}
async function loadBudgets(){ budgets=await api(`/budgets?userId=${encodeURIComponent(userId)}`); renderBudgets(); }
async function loadGoals(){ goals=await api(`/goals?userId=${encodeURIComponent(userId)}`); renderGoals(); }
async function loadInsights(){
  const d=await api(`/insights?userId=${encodeURIComponent(userId)}`);
  renderInsights(d.insights || []);
  renderRecurring(d.recurring || []);
  renderMonthlyChart(d.summary?.monthly || {});
}

function updateStats(){
  const income=transactions.filter(t=>t.type==="income").reduce((s,t)=>s+Number(t.amount),0);
  const expenses=transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+Number(t.amount),0);
  const balance=income-expenses;
  $("income").textContent=money(income);
  $("expenses").textContent=money(expenses);
  $("balance").textContent=money(balance);
  $("rate").textContent=`${(income ? balance/income*100 : 0).toFixed(1)}%`;
}

function renderRecent(){
  const rows=transactions.slice(0,7);
  $("recent").innerHTML=rows.length ? rows.map(t=>`
    <tr><td>${fmtDate(t.date)}</td><td><b>${escapeHtml(t.description)}</b></td><td>${escapeHtml(t.category)}</td>
    <td><span class="pill ${t.type}">${t.type}</span></td><td class="${t.type}">${t.type==="income"?"+":"-"}${money(t.amount)}</td></tr>`).join("")
    : `<tr><td colspan="5" class="muted">No transactions yet. Import a CSV to begin.</td></tr>`;
}
function renderTransactions(){
  const q=($("search")?.value||"").toLowerCase();
  const rows=transactions.filter(t=>(t.description||"").toLowerCase().includes(q)||(t.category||"").toLowerCase().includes(q));
  $("allTx").innerHTML=rows.length ? rows.map(t=>`
    <tr><td>${fmtDate(t.date)}</td><td><b>${escapeHtml(t.description)}</b></td><td>${escapeHtml(t.category)}</td>
    <td><span class="pill ${t.type}">${t.type}</span></td><td>${t.source}</td><td class="${t.type}">${t.type==="income"?"+":"-"}${money(t.amount)}</td>
    <td><button class="link" onclick="deleteTx('${t._id}')">Delete</button></td></tr>`).join("")
    : `<tr><td colspan="7">No transactions found.</td></tr>`;
}
async function deleteTx(id){
  if(!confirm("Delete this transaction?"))return;
  try{await api(`/transactions/${id}`,{method:"DELETE"});toast("Deleted");await loadTransactions();await loadInsights();}
  catch(err){toast(err.message);}
}

function renderCategoryChart(){
  const totals={};
  transactions.filter(t=>t.type==="expense").forEach(t=>totals[t.category]=(totals[t.category]||0)+Number(t.amount));
  const labels=Object.keys(totals), values=Object.values(totals);
  if(categoryChart)categoryChart.destroy();
  $("legend").innerHTML=labels.map(l=>`<span>${escapeHtml(l)} · ${money(totals[l])}</span>`).join("") || "<span>No expense data yet</span>";
  if(!labels.length)return;
  categoryChart=new Chart($("categoryChart"),{type:"doughnut",data:{labels,datasets:[{data:values,borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},cutout:"68%"}});
}
function renderMonthlyChart(monthly){
  const labels=Object.keys(monthly).sort();
  if(monthlyChart)monthlyChart.destroy();
  if(!labels.length)return;
  monthlyChart=new Chart($("monthlyChart"),{type:"bar",data:{labels,datasets:[
    {label:"Income",data:labels.map(k=>monthly[k].income),borderRadius:8},
    {label:"Expenses",data:labels.map(k=>monthly[k].expenses),borderRadius:8}
  ]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true}}}});
}
function renderInsights(items){
  const html=items.length?items.map(i=>`<div class="insight">${escapeHtml(i)}</div>`).join(""):`<div class="insight">Add more financial data to get recommendations.</div>`;
  $("dashboardInsights").innerHTML=html;
  $("allInsights").innerHTML=html;
}
function renderRecurring(items){
  $("recurringList").innerHTML=items.length?items.map(x=>`
    <div class="panel"><small>${escapeHtml(x.frequency)}</small><h3>${escapeHtml(x.description||"Repeated expense")}</h3>
    <b style="display:block;font-size:25px;margin:8px 0">${money(x.averageAmount)}</b><div class="muted" style="font-size:10px">${x.occurrences} occurrences · last seen ${fmtDate(x.lastSeen)}</div></div>`).join("")
    : `<div class="panel"><h3>No recurring pattern detected yet</h3><p class="muted">Use at least three similar transactions so the detector has enough history.</p></div>`;
}
function sameMonth(date,month){
  const d=new Date(date);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`===month;
}
function renderBudgets(){
  $("budgetList").innerHTML=budgets.length?budgets.map(b=>{
    const spent=transactions.filter(t=>t.type==="expense"&&t.category===b.category&&sameMonth(t.date,b.month)).reduce((s,t)=>s+Number(t.amount),0);
    const pct=b.amount?spent/b.amount*100:0;
    return `<div class="row-card"><div class="between"><b>${escapeHtml(b.category)}</b><span>${money(spent)} / ${money(b.amount)}</span></div>
      <div class="progress"><span style="width:${Math.min(pct,100)}%"></span></div><div class="between"><small>${b.month}</small><small>${pct>100?money(spent-b.amount)+" over":money(b.amount-spent)+" remaining"}</small></div></div>`;
  }).join(""):`<div class="row-card">No budgets yet.</div>`;
}
function renderGoals(){
  $("goalList").innerHTML=goals.length?goals.map(g=>{
    const pct=g.targetAmount?Math.min(Number(g.currentAmount||0)/Number(g.targetAmount)*100,100):0;
    return `<div class="row-card"><div class="between"><b>${escapeHtml(g.name)}</b><b>${pct.toFixed(0)}%</b></div>
      <div class="progress"><span style="width:${pct}%"></span></div><div class="between"><small>${money(g.currentAmount)} saved</small><small>Target ${money(g.targetAmount)}</small></div>
      <small class="muted">Target date: ${fmtDate(g.targetDate)}</small></div>`;
  }).join(""):`<div class="row-card">No savings goals yet.</div>`;
}

$("txForm").addEventListener("submit",async e=>{
  e.preventDefault();
  try{
    await api("/transactions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      userId,amount:Number($("txAmount").value),type:$("txType").value,description:$("txDescription").value.trim(),
      category:$("txCategory").value,date:$("txDate").value
    })});
    e.target.reset();$("txDate").value=new Date().toISOString().slice(0,10);
    toast("Transaction saved");await loadTransactions();await loadInsights();
  }catch(err){toast(err.message);}
});

$("budgetForm").addEventListener("submit",async e=>{
  e.preventDefault();
  try{
    await api("/budgets",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      userId,category:$("budgetCategory").value,month:$("budgetMonth").value,amount:Number($("budgetAmount").value)
    })});
    e.target.reset();setDefaults();toast("Budget saved");await loadBudgets();await loadInsights();
  }catch(err){toast(err.message);}
});

$("goalForm").addEventListener("submit",async e=>{
  e.preventDefault();
  try{
    await api("/goals",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      userId,name:$("goalName").value.trim(),targetAmount:Number($("goalTarget").value),
      currentAmount:Number($("goalCurrent").value||0),targetDate:$("goalDate").value
    })});
    e.target.reset();setDefaults();toast("Goal created");await loadGoals();await loadInsights();
  }catch(err){toast(err.message);}
});

function openImport(){$("importModal").classList.add("show");}
function closeImport(){$("importModal").classList.remove("show");}
$("importForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const file=$("csvFile").files[0];if(!file)return;
  const fd=new FormData();fd.append("file",file);fd.append("userId",userId);
  try{
    const d=await api("/import/csv",{method:"POST",body:fd});
    closeImport();e.target.reset();toast(d.message);await loadAll();
  }catch(err){toast(err.message);}
});

function setDefaults(){
  const today=new Date();const date=today.toISOString().slice(0,10);const month=date.slice(0,7);
  $("txDate").value ||= date;$("budgetMonth").value ||= month;
  const target=new Date();target.setMonth(target.getMonth()+6);$("goalDate").value ||= target.toISOString().slice(0,10);
}
setDefaults();
startWorkspace();
