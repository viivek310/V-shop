"use client"
import SimpleImageSlider from "react-simple-image-slider";

const images = [
  { url: "images/imgage1.jpg" },
  { url: "images/image2.jpg" },
  { url: "images/image3.jpg" },
  { url: "images/image5.jpg" },
 
 
];

export default function Slideshow (){
  return (
    <div className="relative lg:h-[70svh] md:h-[50svh] h-[30svh]  before:absolute before:h-[100%] before:w-[100%] before:z-10 before:bg-gradient-to-b from-transparent to-zinc-700">
      <SimpleImageSlider
        width={"100%"}
        height={"100%"}
        images={images}
        showBullets={true}
        showNavs={false}
        autoPlay={true}
        className="md:h-[50svh] h-[30svh]"
        
      />
    </div>

  );
}