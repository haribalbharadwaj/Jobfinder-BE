const validateJob = async (req, res, next) => {
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
        information
    } = req.body;

    // Check for missing fields
    if (!companyName || !logoUrl || !jobPosition || !salary || !jobType || !jobMode || !location || !description || !aboutCompany || !skillsRequired || !information) {
        return res.status(400).json({
            message: 'Please provide all the required fields'
        });
    }

    // Validate and parse skillsRequired
    let skillsArray;
    try {
        if (!Array.isArray(skillsRequired)) {
            skillsArray = skillsRequired.split(',').map(skill => skill.trim());
        } else {
            skillsArray = skillsRequired;
        }
        if (!Array.isArray(skillsArray) || !skillsArray.every(skill => typeof skill === 'string' && skill.length > 0)) {
            throw new Error('Invalid skills format');
        }
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid skills format. It should be a comma-separated string.'
        });
    }

    // Define valid enums
    const validJobTypes = ['fullTime', 'part-time', 'internship', 'contract'];
    const validJobModes = ['remote', 'office', 'hybrid'];

    // Validate fields
    const parsedSalary = Number(salary);
    const validSalary = !isNaN(parsedSalary) && parsedSalary > 0;
    const validJobType = validJobTypes.includes(jobType);
    const validJobMode = validJobModes.includes(jobMode);
    const validLogoUrl = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(logoUrl);

    if (!validJobType) {
        return res.status(400).json({
            message: 'Invalid job type'
        });
    }
    if (!validJobMode) {
        return res.status(400).json({
            message: 'Invalid job mode'
        });
    }
    if (!validSalary) {
        return res.status(400).json({
            message: 'Invalid salary'
        });
    }
    if (!validLogoUrl) {
        return res.status(400).json({
            message: 'Invalid logo URL'
        });
    }

    // Update the request body
    req.body.skillsRequired = skillsArray;
    req.body.salary = parsedSalary;
    next();
};

module.exports = validateJob;
