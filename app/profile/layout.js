import { Inter } from "next/font/google";
// import ProfileNav from "../components/profileNav";
import ProfileNav from "../components/ProfileNav";



const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "V-shop",
  description: "a shopping website",
};



export default function RootLayout({ children }) {
  return (
    <>
        {<ProfileNav/>}
        
        {children}
    </>        
  );
}
