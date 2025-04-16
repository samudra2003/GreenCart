import Product from "../models/Product";


//Add Product : /api/product/add
export const addProduct = async (req, res) => {  
    try {
      
        let productData = JSON.parse(req.body.productData);

        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
               let result = await cloudinary.uploader.upload(item.path, {
                    resource_type:'image'
                });
                return result.secure_url;
            })
        )
       await Product.create({...productData, image: imagesUrl});
       res.json({success: true, message: "Product added"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//Get All Products : /api/product/list
export const productList = async (req, res) => {

}

//Get Product By Id : /api/product/id
export const productById = async (req, res) => {

}

//cahnge Product inStock : /api/product/stock
export const changeStock = async (req, res) => {

}
