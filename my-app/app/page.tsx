import Image from "next/image";
import Navbar from './components/navbar'
import Hero from './components/hero'
import Table from './components/table/page'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Table />
    </main>
  )
}