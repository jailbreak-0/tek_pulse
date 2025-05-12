import ClientMapWrapper from "@/components/ClientMapWrapper"

const page = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Campus Map</h2>
      <p className="mb-4">
        Want a Virtual Tour of the campus?
        <a 
          href="https://virtualtour.knust.edu.gh" 
          className="text-[#22AB39] hover:underline ml-2 hover:text-green-700"
        >
          Click Here!
        </a>
      </p>
        <ClientMapWrapper />
    </div>
    
  )
}

export default page