import {sql} from "../config/db.js"

export const getAllProducts = async (req, res) => {
    try {
        const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `;

        console.log("Fetched products:", products);
        res.status(200).json({ success: true, data: products });

    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const createProduct =async (req , res) =>{
    const {name , price , image} = req.body;

    if(!name || !price || !image){
        return res.status(400).json({message:"All fields are required"})
    }

    try{
        const newProduct = await sql`
        INSERT INTO products (name,price ,image)
        VALUES (${name},${price},${image})
        RETURNING * 
        `
        console.log("product added")
        res.status(201).json({success:true , data:newProduct[0]})

    }catch(err){
        console.error("Error creating product:", err);
        res.status(500).json({ success: false, message: "Server error" });

    }

};

export const getProduct= async (req, res) => {
    const {id} = req.params

    try{
        const product = await sql`
        SELECT * FROM products WHERE id=${id}
        `
        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({success:true , data:product[0]})
    }catch(err){
        console.error("Error in getting the product:", err);
        res.status(500).json({ success: false, message: "Server error" });

    }
};

export const updateProduct =async (req , res) =>{
const {id}  = req.params;
const {name , price , image} = req.body;

try{
    const updatedProduct = await sql`
   UPDATE products
   SET name=${name} , price=${price} , image=${image}
   WHERE id=${id}
    `

if(updateProduct.length==0){
    return res.status(404).json({message:"Product not found"}) 
}
    res.status(200).json({success:true, data: updateProduct[0]})

}catch(err){
    console.error("Error in updating the product:", err);
    res.status(500).json({ success: false, message: "Server error" });


}
};

export const deleteProduct =async (req , res) =>{
const {id} = req.params
try{
    const deletedProduct = await sql`
    DELETE FROM products WHERE id=${id} RETURNING *
    `
    if(updateProduct.length==0){
        return res.status(404).json({message:"Product not found"}) 
    }

    res.status(200).json({success:true , data:deleteProduct[0]})
}catch(err){
    console.error("Error in deleting the product:", err);
    res.status(500).json({ success: false, message: "Server error" });

}
};