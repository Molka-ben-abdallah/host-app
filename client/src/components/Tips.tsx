interface TipsProps {
  title: string;
  text: string;
}

const Tips: React.FC<TipsProps> = ({ title, text }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl p-4 ">
        <h1 className="font-primaryBold text-3xl text-[#686868] m-5">{title}</h1>
        <div className="bg-[#F1F1F1] p-4 rounded-lg shadow-md">
          <h2 className="font-primaryBold text-lg text-black mb-2">Tip</h2>
          <p className="font-primaryRegular text-black-600">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Tips;
