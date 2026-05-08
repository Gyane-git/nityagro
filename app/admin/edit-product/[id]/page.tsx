
"use client";
import { useParams } from "next/navigation";



export default async function EditProductPage() {
   const params = useParams();
  
   const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  console.log(productId);
  alert(productId)
 

  return <div>Edit Productdsfg</div>;
}