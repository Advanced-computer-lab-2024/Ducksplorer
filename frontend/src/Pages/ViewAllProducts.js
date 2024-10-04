import { useEffect, useState } from "react"
import React from 'react';
import '../Components/ProductDetails.css';
import ProductDetails from "../Components/ProductDetails"

const AllProducts = () => {
  const [products, setProducts] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:8000/sellerRoutes/getproducts')
      const json = await response.json()

      if (response.ok) {
        setProducts(json)
      }
    }

    fetchProducts()
  }, [])


  return (
    <div className="containerF">
        <div className="columnF">
        {products && products.map(product => (
          <ProductDetails product={product} key={product._id} />
        ))}
      </div>
    </div>
  )
}



export default AllProducts
