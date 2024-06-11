import React, { useContext } from 'react'
import Image from 'next/image'
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import cartProducts from '../context/context';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/navigation';




const AdminProduct = ({ product }) => {
  const router = useRouter()
  const [open, setOpen] = React.useState(false);
  const { cartItems, setCartItems } = useContext(cartProducts);
  const {products, setproducts} = useContext(cartProducts)
  const deleteProduct = async (id) => {
    // router.refresh()
    const res = await fetch("/api/product/delete", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'content': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    if(res.ok){
      const newProducts = [...products]
      const delProdcuts = newProducts.filter((pro)=>{
        pro.productID===id
      })
      setproducts(delProdcuts)
    }
    // location.reload()
  }
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <React.Fragment>
        {/* <Button variant="outlined" onClick={handleClickOpen}>
          Open alert dialog
        </Button> */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this product?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ID - {product.productID},
              Name - {product.productName}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => { deleteProduct(product.productID); handleClose() }} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>




      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 h-1 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td className="p-4 h-40 md:block hidden">
          <Image src={product.images[0]} height={100000} width={100000} className=" md:w-32 max-w-full max-h-full h-full w-full object-cover" alt="Apple Watch"/>
        </td>
        <td className=" px-1 md:px-6 py-4 md:overflow-hidden md:text-ellipsis md:whitespace-nowrap text-wrap overflow-clip font-semibold text-gray-900 dark:text-white">
        {product.productName}
        </td>
        <td className="px-3 md:px-6">
          <div className="flex items-center text-white">
           {product.quantity}
          </div>
        </td>
        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
          ₹{product.productDisPrice}
        </td>
        <td className="px-6 py-4">
          <div onClick={handleClickOpen} className="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</div>
        </td>
      </tr>
    </>
  )
}

export default AdminProduct
