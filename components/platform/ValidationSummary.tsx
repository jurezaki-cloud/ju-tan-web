import ErrorMessage from "./ErrorMessage";

export default function ValidationSummary({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <ul className="mb-4 space-y-1" role="alert">
      {errors.map((error) => (
        <li key={error}>
          <ErrorMessage>{error}</ErrorMessage>
        </li>
      ))}
    </ul>
  );
}
