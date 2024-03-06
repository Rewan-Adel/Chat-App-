const cloudinary = require('../config/cloudinary');

const uploadImage = (Model)=> asyncHandler( async(req, res, next) =>{  
    const data = await Model.findById(req.body.id);

    if(!data)
       return next(new appError('Not found', 404));

    if(! req.file) 
        return next(new appError("Please upload an image", 400));
    try{

        const img  = await cloudinary.uploader.upload(req.file.path);
        data.image.url       = img.secure_url;
        data.image.public_id = img.public_id;
    
        await data.save();
        return res.status(200).json({
            status: 'success',
            image : data.image
        });
    }catch(err){
        console.log(err);
        res.status(500).json("Error in upload image");
    }
 });

module.exports =  uploadImage;
