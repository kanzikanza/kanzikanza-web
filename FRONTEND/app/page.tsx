import Image from 'next/image'
import Maincarousel from './maincarousel'
import Bottomcontainer from './bottomcontainer'

export default function Home() {
  return (

    <div className='frame-layout'>
      <Maincarousel />
      
      <Bottomcontainer />

    </div>

  )
}
