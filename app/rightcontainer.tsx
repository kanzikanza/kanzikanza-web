'use client'

export default function rightcontainer(props : { size : number }) {
    let val : number = props.size;
    // {`w-${val}/12 h-52`}
    let denominator : number = 12;

    return (
        <div className={`w-1/2 h-52`}>
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-4`}>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-6.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-7.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-8.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-9.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-10.jpg" alt="" />
            </div>
            <div>
                <img className="h-auto  rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg" alt="" />
            </div>
        </div>
        </div>
        )
}