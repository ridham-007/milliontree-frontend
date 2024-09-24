import Modal from '@mui/material/Modal'; // Assuming you're using Material-UI for the modal
import Box from '@mui/material/Box';
interface CustomModalProps {
    handleClose?:any;
    open?:any;
    modelData?: any;
}
const CustomModal = ({ handleClose, open, modelData }: CustomModalProps) => {

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            border:'none',
            boxShadow: 24,
            maxWidth: {
              xs: "94%",
              sm: "500px",
              md: "600px",
              lg: "700px",
            },
          }}
        >
          {modelData}
        </Box>
      </Modal>
    </>
  );
};

export default CustomModal;
