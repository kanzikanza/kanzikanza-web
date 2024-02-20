import Image from 'next/image'
import Maincarousel from './Carousel'
import Bottomcontainer from './Bottom'

export default function Home() {
  return (

    <div className='frame-layout'>
      <Maincarousel />
      
      <Bottomcontainer />
    </div>

  )
}
