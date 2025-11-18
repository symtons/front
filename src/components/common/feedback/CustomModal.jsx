import CustomModal from '../../components/common/feedback/CustomModal';
import { Button } from '@mui/material';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        title="Modal Title"
        subtitle="Optional subtitle"
        size="md"
      >
        <p>Your content goes here</p>
      </CustomModal>
    </>
  );
}