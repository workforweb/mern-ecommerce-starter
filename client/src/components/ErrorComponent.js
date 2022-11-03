function ErrorComponent({ error }) {
  return (
    Object.keys(error).length > 0 && (
      <div className="list">
        {Object.values(error).map((value, i) => (
          <div className="text-danger text-center" role="alert" key={i}>
            {value}
          </div>
        ))}
      </div>
    )
  );
}

export default ErrorComponent;
