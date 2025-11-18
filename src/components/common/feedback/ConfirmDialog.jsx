import ConfirmDialog from '../../components/common/feedback/ConfirmDialog';

function MyComponent() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = () => {
    // Perform delete action
    setConfirmOpen(false);
  };

  return (
    <>
      <Button onClick={() => setConfirmOpen(true)} color="error">
        Delete
      </Button>
      
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Employee?"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        variant="error"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}