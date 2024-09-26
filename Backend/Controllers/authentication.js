const signUp = (req,res) => { //req gai mn el frontend el etmalet wa2t el signup
    const {email,userName,password} = req.body;
    if(req.body.type.equals("Tourist")){
        const mobileNumber = req.body.mobileNumber;
        const nationality = req.body.nationality;
        const DOB = req.body.DOB;
        const employmentStatus = req.body.employmentStatus;
    }
    if(req.body.type.equals("TourGuide")){
        const mobileNumber = req.body.mobileNumber;
        const yearsOfExperience = req.body.yearsOfExperience;
        const previousWork = req.body.previousWork;
    }
    if(req.body.type.equals("Seller")){
        const description = req.body.description;
        const name = req.body.name;
    }
    if(req.body.type.equals("Advertiser")){
        const websiteLink = req.body.websiteLink;
        const hotline = req.body.hotline;
        const companyProfile = req.body.companyProfile;
    }

 
}
