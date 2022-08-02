import Image from "next/image";

export const TrackCard = ({ song }) => {
    
console.log(song);

return (
    <div className="flex items-center space-x-4 w-full border-2 border-blue-600 rounded-2xl px-4 py-4 mt-4">
        <span>#{song.trackNumber}</span>
        <div className=" border border-stone-500 rounded-lg overflow-hidden">
        <Image
            src={URL.createObjectURL(song.imageCoverFile)}
            alt="preview url for track"
            layout="fixed"
            objectFit="cover"
            width={60}
            height={60}
        />
        </div>
        <div>
        <div className="font-medium">
            Title: <span className="font-normal">{song.title}</span>
        </div>
        <div className="font-medium">
            Artist: <span className="font-normal">{song.artist}</span>
        </div>
        </div>
    </div>
    );
};

export default TrackCard;