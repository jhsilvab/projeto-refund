// Seleciona os elementos do formulario
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Adiciona os elementos da lista 
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

//captura o evento de input para formatar o valor
amount.oninput = () => {
  //obtem o valor atual do input e remove os caracteres nao numericos
  let value = amount.value.replace(/\D/g, "")

  //transformar o valor em centavos (exemplo: 150/100 = 1.5 equivalente a R$ 1,50).
  value = Number(value) / 100
  
  //atualiza o valor do input
  amount.value = formatCurrencyBRL(value)//devolvendo apenas numeros no input, 
}//on input analisa se um novo valor foi inserido no input

function formatCurrencyBRL(value){
  // formata o valor no padrao brl
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  //retorna o valor formatado
  return value 
}

//captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
  //previne o comportamento padrao de recarregar a pagina
  event.preventDefault()

  //cria um objeto com os detalhes na nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,//pega as opcoes dentro do category, porem, pega apenas a selecionada
    amount: amount.value,
    created_at: new Date(),//sinaliza quando a despesa foi criada
  }

  //chama a funcao que ira adicionar o item na lista
  expenseAdd(newExpense)
}

//adiciona um novo item na lista
function expenseAdd(newExpense){
  try {
    //cria o elemento de li para adicionar o item(li) na lista(ul)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")
    
    //cria o icone da categoria 
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    //adiciona o nome dos icones adicionando a imagem na page
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense//passa qual o nome da despesa

    //cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    //Adiciona name e category na div das informacoes das despesa
    expenseInfo.append(expenseName, expenseCategory)

    //cria o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `
    <small>R$</small>
    ${newExpense.amount
    .toUpperCase()
    .replace("R$", "")}
    `//escreve a propria sintaxe do html

      //cria o icone de remover
      const removeIcon = document.createElement("img")
      removeIcon.classList.add("remove-icon")
      removeIcon.setAttribute("src", "img/remove.svg")
      removeIcon.setAttribute("alt", "remover")

    // Adiciona as informacoes no item 
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    //Adiciona o item na lista
    expenseList.append(expenseItem)
    

    //limpa o formulario
    formClear()

    //Atualiza os totais
    updateTotals()
  } catch (error) {
    alert("Não foi possivel atualizar a lista de despesas.")
    console.log(error)
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    //recuper todos os itens (li) da lista (ul)
    const items = expenseList.children

    //atualiza a quantidade de itens da lista 
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"}`

    //variavel para incrementar o total
    let total = 0

    //percorre cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++){
      const itemAmount = items[item].querySelector(".expense-amount")

      //remover caracteres nao numericos e substitui a virgula pelo ponto.
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

      //Converte o valor para float.
      value = parseFloat(value)

      //Verifica se e um numero valido
      if(isNaN(value)){
        return alert ("Não possível calcular o total. O valor não parece ser um numero.")
      }

      //incrementar o valor total
      total += Number(value)
    }

    //Cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    //formata o valor e remove o R$ que sera exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase("R$", "")

    //limpa o conteudo do elemento
    expensesTotal.innerHTML = ""

    //Adiciona o simbolo da moeda e o valor formatado
    expensesTotal.append(symbolBRL, total)
  
  } catch (error) {
    console.log(error)
    alert("Não possível atualizar os totais.")
  }
}

//evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function(event){
  //verifica se o elementom clicado e o icone de remover
  if(event.target.classList.contains("remove-icon")){
    //obtem a li pai do elemento clicado
    const item = event.target.closest(".expense")

    // remove o item da lista
    item.remove()
   
  }
  //atualiza os totais
  updateTotals()
})

function formClear(){
  //limpa os inputs
  expense.value = ""
  category.value = ""
  amount.value = ""

  //coloca o foco no input de amount
  expense.focus()
}