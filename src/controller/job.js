const Job = require('../model/job')

const allJobs = async(req,res)=>{
    try{
        const jobs = await Job.find()
        res.json({
            status:"SUCCESS",
            data: jobs
        })
    }catch(error){
        res.status(500).json({
            status:"Failed",
            message:"Something went wrong"
        })
    }
}



const getJobs = async(req,res)=>{
    try{
        const jobID = req.params.id;
        const job = await Job.findById(jobID);
        if(job){
            return res.status(200).json({
                message:'Job found',
                data:job 
            })
        }else{
            return res.status(404).json({
                status:'Failed',
                message:'Job not found'
            })
        }
    }catch(error){
        res.status(500).json({
            status:"Failed",
            message:"Something went wrong"
        })
    }
}

const addJobs = async(req,res,next)=>{
    const {
        companyName,
        logoUrl,
        jobPosition,
        salary,
        jobType,
        jobMode,
        location,
        description,
        aboutCompany,
        skillsRequired,
        information,
    } = req.body
   

    if (!companyName || !logoUrl || !jobPosition || !salary || !jobType || !jobMode || !location || !description || !aboutCompany || !skillsRequired || !information) {
        return res.status(400).json({
            status: "Failed",
            message: "All fields are required"
        });
    }
    try{
    
        const newJob = await Job.create({
            companyName,
            logoUrl,
            jobPosition,
            salary,
            jobType,
            jobMode,
            location,
            description,
            aboutCompany,
            skillsRequired,
            information,
            refUserId :  req.userID
        })
        res.status(201).json({
            status:"SUCCESS",
            message:'Job added successfully',
            data: newJob
        })
    }catch(error){
        next({
            message: "Error Adding Job",
            error: error.message
        });
    }
}

const editJobs = async(req,res)=>{
    try{
        const { id } = req.params;
        const {
        companyName,
        logoUrl,
        jobPosition,
        salary,
        jobType,
        jobMode,
        location,
        description,
        aboutCompany,
        skillsRequired,
        information,
        refUserId} = req.body

        const job = await Job.findByIdAndUpdate(id,{
            companyName,
            logoUrl,
            jobPosition,
            salary,
            jobType,
            jobMode,
            location,
            description,
            aboutCompany,
            skillsRequired,
            information,
            refUserId},{new:true})

            if(!job){
                return res.status(404).json({
                    status:'Failed',
                    message:'Job not found'
                })
            }

                res.json({
                    status:"Job updated successfully",
                    data:job
                })
        }catch(error){
            res.status(500).json({
                status: "Failed",
                message: "Something went wrong"
        })
    }
}

const getFilteredJobs = async(req,res,next)=>{
    try{
        const {minSalary,maxSalary,jobType,location,jobMode,skills} = req.query;
        const skillsArray = skills?skills.split(','):[];
        const jobs = await Job.find({
            monthlySalary:{
                $gte: minSalary ||0,
                $lte: maxSalary ||999999999
            },
            jobType:jobType || {$exists:true},
            location: location || {$exists:true},
            jobMode: jobMode ||{$exists:true},
            });

        const finalJobs = jobs.filter(job=>{
            let isSkillMatched = true;
            if(skillsArray.length>0){
                isSkillMatched = skillsArray.every(skill=>job.skillsRequired.includes(skill));
            }
            return isSkillMatched;
        });
        res.status(200).json({
            message:'Filtered jobs retrieved successfully',
            status:'SUCCESS',
            jobs:finalJobs
        })
    }
    catch(error){
        next({
            message:"Error Finding Jobs",
            error
    });
    }
}

const deleteJob = async(req,res,next)=>{
    try{
        const jobId = req.params.id;
        await Job.findByIdAndDelete(jobId);
        res.status(200).json({
            message:'Job deleted successfully'
        })
    }
    catch(error){
        next('Error deleting job', error);
    }

}


module.exports = {
    allJobs,
    getJobs,
    addJobs,
    editJobs,
    getFilteredJobs,
    deleteJob
} 