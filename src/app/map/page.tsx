import ClientMapWrapper from "@/components/ClientMapWrapper"

const page = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Campus Map</h2>
        <ClientMapWrapper />
    </div>
    
  )
}

export default page