import Form from 'react-bootstrap/Form';

export default function SelectInput({ label, value, options, onChange }) {
  return (
    <div className="select">
      <label className="select-label">{label}</label>
      <Form.Select
        value={value}
        onChange={onChange}
        aria-label="Select from categories"
        className="select-input"
      >
        {options.map((option, index) => (
          <option value={option} key={index}>
            {option}
          </option>
        ))}
      </Form.Select>
    </div>
  );
}
