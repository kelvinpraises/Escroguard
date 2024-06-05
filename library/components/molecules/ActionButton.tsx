interface ActionButtonProps {
  onClick: () => void;
  imgSrc: string;
  title: string;
  description: string;
}

function ActionButton({ onClick, imgSrc, title, description }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="min-w-[530px] flex p-4 gap-4 items-center rounded-[5px] border-2 border-[#E0E0E0] cursor-pointer"
    >
      <img src={imgSrc} alt={title} />
      <div className="flex flex-col items-start gap-1">
        <p className="text-[#292929] text-xl font-medium">{title}</p>
        <p className="text-[#5B5B5B] font-medium">{description}</p>
      </div>
    </button>
  );
}

export default ActionButton;
