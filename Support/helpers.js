
// ingredients come in as ['ham', 'cheese', 'bread']
// output as 'ham,+cheese,+bread'
const formatIngredients = (ingredientsArray) => {
    return ingredientsArray.join(',+')
}

module.exports = {
    formatIngredients
}