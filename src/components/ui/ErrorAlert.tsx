interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="mb-4 rounded-sm bg-red-50 p-3 text-sm text-red-600">
      {message}
    </div>
  );
}
