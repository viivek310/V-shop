import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div className="container mx-auto px-8 md:px-24 py-12 text-gray-800 leading-8">
      <section className='abtsec boutus mb-12'>
        <h1 className="font-bold text-4xl md:text-5xl mb-6">V-shop - About Us</h1>
        <p className="text-lg md:text-xl">We're more than just an online store; we're a team of passionate individuals driven by a love for making life easier and more enjoyable for our customers. V-shop was founded with the vision of creating a convenient and reliable platform where you can find everything you need, from the latest clothing trends to cutting-edge electronics and all the gadgets in between.</p>
      </section>
      <section className='abtsec'>
       <h2 className="font-bold text-2xl md:text-3xl mt-10 mb-4">From Humble Beginnings to Your Doorstep</h2>
        <p className="text-lg md:text-xl mb-6">V-shop began in 2022 with a simple dream: to bridge the gap between convenience and quality. We noticed the frustration of having to browse multiple stores for different products. We envisioned a one-stop shop where you could find everything you need, from refilling your wardrobe staples to discovering the latest tech gadgets, all while ensuring exceptional quality. Since then, we've grown into a trusted one-stop shop, catering to customers who value convenience, variety, and quality.</p>
        <div className="image flex justify-center items-center my-5">
          <img src="/images/smartphone.jpg" alt="V-shop Team" className="w-full max-w-lg rounded-lg shadow-md" />
        </div>
      </section>

      <section className='abtsec'>


        <h2 className="font-bold text-3xl md:text-4xl mb-6">Our Values: Your Guarantee</h2>
        <p className="text-lg md:text-xl mb-6">These core values guide everything we do at V-shop:</p>
        <ul className="text-lg md:text-xl mb-8 pl-4">
          <li><span className='font-bold'>Unbeatable Variety</span>: Because you shouldn't have to browse multiple stores to find what you need.</li>
          <li><span className='font-bold'> Exceptional Quality</span>: Because we believe you deserve products that last.</li>
          <li><span className='font-bold'>Hassle-Free Shopping</span>: Because your time is valuable, and shopping should be enjoyable.</li>
        </ul>
      </section>

      <section className='abtsec'>

        <h2 className="font-bold text-3xl md:text-4xl mb-6">Why Choose V-shop?</h2>
        <p className="text-lg md:text-xl mb-6">With a vast selection like ours, why choose V-shop? Here's what sets us apart:</p>
        <ul className="text-lg md:text-xl mb-8  pl-4">
          <li><span className="font-bold">Convenience</span>: Find everything you need in one place, saving you time and effort.</li>
          <li><span className="font-bold">Quality</span>: We curate our selection to ensure you get the best possible products.</li>
          <li><span className="font-bold">Competitive Prices</span>: We offer great value on all our products.</li>
          <li><span className="font-bold">Exceptional Customer Service</span>: Our friendly team is always here to help you find what you're looking for.</li>
        </ul>

        <p className="text-lg md:text-xl mb-8">We're confident you'll love the variety, quality, and exceptional shopping experience we provide at V-shop.</p>
      </section>

      <section className='abtsec'>
        <h2 className="font-bold text-3xl md:text-4xl mb-6">Let's Connect!</h2>
        <p className="text-lg md:text-xl mb-4">We love hearing from our customers! Follow us on social media for a glimpse behind the scenes!</p>
        <div className="socialmedias flex gap-5 justify-center items-center mb-8">
          <span className="text-blue-500 hover:underline cursor-pointer">Instagram</span>
          <span className="text-blue-500 hover:underline cursor-pointer">Twitter</span>
          <span className="text-blue-500 hover:underline cursor-pointer">Facebook</span>
        </div>
        <p className="text-lg md:text-xl">We're so excited to welcome you to the V-shop family!</p>
      </section>
    </div>
  )
}

export default page
