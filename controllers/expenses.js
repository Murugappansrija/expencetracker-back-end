const ExpenseSchema = require("../models/expensemodel")

exports.addExpense = async(req,res)=>{
   const{title,amount,category,description,date} = req.body
   const expense = ExpenseSchema({
    title,
    amount,
    category,
    description,
    date
   })
   try {
    //validations
    if(!title || !category ||!description || !date ){
        return res.status(400).json({
            message:'All fields are required !' 
            
        })
    }
    if(amount<=0 || !amount=== 'number'){
        return res.status(400).json({
            message:'Amount must be a positive number !'
        })
    }
    if(!expense){

        res.status(400).json({
            message:'You are entered same data !'
        })
      
    }else{
         await expense.save()
        res.status(200).json({
            message:'Expense Added'
        })
    }

    
   } catch (error) {
    res.status(500).json({message:'Server Error'})
   }

}

exports.getExpense = async(req,res)=>{
    try {
        const expense = await ExpenseSchema.find().sort({createAt:-1})
        res.status(200).json(expense)
    } catch (error) {
        res.status(500).json({message:'Server Error'})
    }
}

exports.deleteExpense = async(req,res)=>{
  const {id} =req.params;
  ExpenseSchema.findByIdAndDelete(id)
  .then((expense)=>{
    res.status(200).json('Expense Deleted')
  })
  .catch((err)=>{
    res.status(500).json({message:'Server Error'})
  })
}