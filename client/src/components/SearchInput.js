import Form from 'react-bootstrap/Form';

export default function SearchInput({
  value,
  placeholder,
  onChange,
  onMouseEnter,
}) {
  return (
    <Form.Group>
      <Form.Control
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onMouseEnter={onMouseEnter}
      />
    </Form.Group>
  );
}
