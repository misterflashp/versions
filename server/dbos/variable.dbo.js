let VariableModel = require('../models/variable.model');
let getVariable = (cb) =>{
    VariableModel.find({},{ _id :0 },(error,result)=>{
        if (error) cb(error, null);
        else cb(null, result || []);
    });
}

let addVariable = (object,cb) => {
    let variable = new VariableModel(object);
    variable.save((error,result)=>{
        if (error) cb(error, null);
        else cb(null, result || []);
    });
}
let updateVariable = (object,cb) =>{
    let { name,
    value, updatedOn } = object;
    VariableModel.findOneAndUpdate({ name },{
            $set: { 'value':value, 'updatedOn': updatedOn } }, (error, result) => {
                if (error) cb(error, null);
                else cb(null, result || []);
            }
    );
}

module.exports = {
    getVariable,
    updateVariable,
    addVariable
};