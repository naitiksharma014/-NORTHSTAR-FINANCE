export function createResourceController(Model) {
  return {
    list: async (req,res) => { const records=await Model.find(req.admin?{}:{active:true}).sort({order:1,createdAt:-1}).lean();res.json(records); },
    create: async (req,res) => { const record=await Model.create(req.body);res.status(201).json(record); },
    update: async (req,res) => { const record=await Model.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!record)return res.status(404).json({message:'Record not found.'});res.json(record); },
    remove: async (req,res) => { const record=await Model.findByIdAndDelete(req.params.id);if(!record)return res.status(404).json({message:'Record not found.'});res.json({message:'Record deleted.'}); }
  };
}
