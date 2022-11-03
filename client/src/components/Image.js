const Image = ({ source, altText, className, id, width, height }) => {
  return (
    <img
      id={id}
      className={className}
      src={source}
      alt={altText}
      width={width}
      height={height}
    />
  );
};

export default Image;
