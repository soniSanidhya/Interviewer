import { Button, Card, Typography, Grid, Box, Chip, List, ListItem, Divider, 
    Modal, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BoldIcon } from 'lucide-react';

// Dark mode card styling
const cardStyles = {
    color: '#ffffff',
    p: 2,
    height: 390, // Fixed height for all cards
    width: 300, // Fixed height for all cards
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4)'
    }
};

const SkillSection = ({ title, skills, color = "primary" }) => (
<>
<Typography variant="subtitle2" color="text.secondary">{title}</Typography>
<List dense>
 {Object.entries(skills).map(([key, value]) => (
   <ListItem key={key} sx={{ py: 0.5 }}>
     <Chip 
       label={key} 
       color={value ? color : "default"} 
       size="small"
       variant={value ? "filled" : "outlined"}
       sx={{ 
         color: value ? '#fff' : 'inherit',
         bgcolor: value ? '' : 'rgba(255, 255, 255, 0.08)'
       }}
     />
   </ListItem>
 ))}
</List>
</>
);

const QuestionsSection = ({ title, questions }) => (
questions.length > 0 && (
<Grid item xs={12} md={4}>
 <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
 <List>
   {questions.map((q, i) => (
     <ListItem key={i} sx={{ py: 0.5 }}>
       <Typography variant="body2" color="text.secondary">
         {i+1}. {q}
       </Typography>
     </ListItem>
   ))}
 </List>
</Grid>
)
);

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

const countSelectedSkills = (evalForm) => {
if (!evalForm) return 0;

const countSelected = (obj) => Object.values(obj).filter(Boolean).length;

return (
countSelected(evalForm.technicalEvaluation.codingSkills) +
countSelected(evalForm.technicalEvaluation.systemDesign) +
countSelected(evalForm.technicalEvaluation.toolsAndPlatforms) +
countSelected(evalForm.softSkillsAssessment.communication) +
countSelected(evalForm.softSkillsAssessment.collaboration) +
countSelected(evalForm.softSkillsAssessment.adaptability) +
countSelected(evalForm.culturalFit.valuesAlignment) +
countSelected(evalForm.culturalFit.workEthic) +
(evalForm.culturalFit.growthMindset.selfLearning ? 1 : 0)
);
};

function EvalFormDashBoard() {
const navigate = useNavigate();
const [interviewerId, setInterviewerId] = useState("");
const [evalForms, setEvalForms] = useState([]);
const [selectedForm, setSelectedForm] = useState(null);
const [modalOpen, setModalOpen] = useState(false);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const fetchCurrentUser = useCallback(async () => {
try {
 const response = await axios.post('http://localhost:5000/api/getCurrentUser',{}, {
   withCredentials: true
 });
 
 if (response.data.user.type === "interviewer") {
   setInterviewerId(response.data.user._id);
 }
} catch (err) {
 console.error("Error fetching current user:", err);
 setError("Failed to load user data");
}
}, []);

const fetchEvaluationForms = useCallback(async () => {
if (!interviewerId) return;

try {
 const response = await axios.post(
   `http://localhost:5000/api/getAllEvaluationFormByInterviewerId/${interviewerId}`,{} ,
   { withCredentials: true }
 );
 setEvalForms(response.data.evalForms || []);
} catch (err) {
 console.error('Error fetching evaluation forms:', err);
 setError("Failed to load evaluation forms");
} finally {
 setLoading(false);
}
}, [interviewerId]);

useEffect(() => {
fetchCurrentUser();
}, [fetchCurrentUser]);

useEffect(() => {
fetchEvaluationForms();
}, [fetchEvaluationForms]);

const handleViewDetails = (form) => {
setSelectedForm(form);
setModalOpen(true);
};

const handleCloseModal = () => setModalOpen(false);

if (loading) return (
<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
 <Typography color="text.secondary">Loading...</Typography>
</Box>
);

if (error) return (
<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
 <Typography color="error">{error}</Typography>
</Box>
);

return (
<Box sx={{ p: 3, backgroundColor: '', minHeight: '100vh' }}>
 <Typography variant="h4" gutterBottom color="WHITE" sx={{ mb: 3 }}>
   Evaluation Forms Dashboard
 </Typography>
 
 <Button 
   variant="contained" 
   color="primary" 
   onClick={() => navigate('/create-evalForm')}
   sx={{ mb: 3 }}
 >
   Create New Evaluation Form
 </Button>
 
 <Grid container spacing={3}>
   {evalForms.length > 0 ? (
     evalForms.map((form) => (
       <Grid item xs={12} sm={6} md={4} key={form._id}>
         <Card sx={cardStyles}>
           <Typography variant="h6" color="text.primary" gutterBottom>
             Evaluation Form
           </Typography>
           <Typography variant="body2" color="text.secondary">
             Created: {formatDate(form.createdAt)}
           </Typography>
           <Divider sx={{ my: 1.5, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
           
           <Typography variant="subtitle1" color="text.primary">
             Skills Selected: {countSelectedSkills(form.evalForm)}
           </Typography>
           
           {form.evalForm.customQuestions.programQuestions.length > 0 && (
             <Box sx={{ mt: 2 }}>
               <Typography variant="subtitle2" color="text.secondary">Programming Questions:</Typography>
               <List dense>
                 {form.evalForm.customQuestions.programQuestions.map((q, i) => (
                   <ListItem key={i} sx={{ py: 0.5 }}>
                     <Typography variant="body2" color="text.secondary">• {q}</Typography>
                   </ListItem>
                 ))}
               </List>
             </Box>
           )}
           
           {form.evalForm.culturalFit.growthMindset.certifications.length > 0 && (
             <Box sx={{ mt: 1 }}>
               <Typography variant="subtitle2" color="text.secondary">Certifications:</Typography>
               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                 {form.evalForm.culturalFit.growthMindset.certifications.map((cert, i) => (
                   <Chip 
                     key={i} 
                     label={cert} 
                     size="small" 
                     sx={{ 
                       bgcolor: 'primary.dark',
                       color: '#fff'
                     }} 
                   />
                 ))}
               </Box>
             </Box>
           )}
           
           <Box sx={{ mt: 'auto', pt: 2 }}>
             <Button 
               variant="outlined" 
               size="small"
               onClick={() => handleViewDetails(form)}
               fullWidth
               sx={{
                 color: 'primary.light',
                 borderColor: 'primary.light',
                 '&:hover': {
                   bgcolor: 'rgba(66, 165, 245, 0.08)',
                   borderColor: 'primary.main'
                 }
               }}
             >
               View Details
             </Button>
           </Box>
         </Card>
       </Grid>
     ))
   ) : (
     <Grid item xs={12}>
       <Typography variant="body1" align="center" color="text.secondary">
         No evaluation forms found. Create your first one!
       </Typography>
     </Grid>
   )}
 </Grid>

 <Modal
   open={modalOpen}
   onClose={handleCloseModal}
   aria-labelledby="form-details-modal"
   sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
 >
   <Paper sx={{ 
     width: '80%', 
     maxWidth: 800, 
     maxHeight: '90vh', 
     overflow: 'auto', 
     p: 3, 
     position: 'relative',
     border: '1px solid rgba(255, 255, 255, 0.12)',

   }}>
     <IconButton 
       sx={{ 
         position: 'absolute', 
         right: 8, 
         top: 8,
         color: 'text.secondary'
       }} 
       onClick={handleCloseModal}
     >
       <CloseIcon />
     </IconButton>

     {selectedForm && (
       <>
         <Typography variant="h5" gutterBottom color="text.primary">
           Evaluation Form Details
         </Typography>
         <Typography variant="subtitle1" color="text.secondary">
           Created: {formatDate(selectedForm.createdAt)}
         </Typography>
         <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
         
         {/* Technical Skills */}
         <Typography variant="h6" gutterBottom color="text.primary">
           Technical Evaluation
         </Typography>
         <Grid container spacing={2} sx={{ mb: 3 }}>
           <Grid item xs={12} sm={4}>
             <SkillSection 
               title="Coding Skills" 
               skills={selectedForm.evalForm.technicalEvaluation.codingSkills} 
             />
           </Grid>
           <Grid item xs={12} sm={4}>
             <SkillSection 
               title="System Design" 
               skills={selectedForm.evalForm.technicalEvaluation.systemDesign} 
             />
           </Grid>
           <Grid item xs={12} sm={4}>
             <SkillSection 
               title="Tools & Platforms" 
               skills={selectedForm.evalForm.technicalEvaluation.toolsAndPlatforms} 
             />
           </Grid>
         </Grid>

         {/* Soft Skills */}
         <Typography variant="h6" gutterBottom color="text.primary">
           Soft Skills Assessment
         </Typography>
         <Grid container spacing={2} sx={{ mb: 3 }}>
           <Grid item xs={12} sm={4}>
             <SkillSection 
               title="Communication" 
               skills={selectedForm.evalForm.softSkillsAssessment.communication} 
               color="success"
             />
           </Grid>
           <Grid item xs={12} sm={4}>
             <SkillSection 
               title="Collaboration" 
               skills={selectedForm.evalForm.softSkillsAssessment.collaboration} 
               color="success"
             />
           </Grid>
           <Grid item xs={12} sm={4}>
             <SkillSection 
               title="Adaptability" 
               skills={selectedForm.evalForm.softSkillsAssessment.adaptability} 
               color="success"
             />
           </Grid>
         </Grid>

         {/* Cultural Fit */}
         <Typography variant="h6" gutterBottom color="text.primary">
  Cultural Fit
</Typography>
<Grid container spacing={2} sx={{ mb: 3 }}>
  <Grid item xs={12} sm={4}>
    <SkillSection 
      title="Values Alignment" 
      skills={selectedForm.evalForm.culturalFit.valuesAlignment} 
      color="warning"
    />
  </Grid>
  
  <Grid item xs={12} sm={4}>
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Growth Mindset
      </Typography>
      <List dense sx={{ flexGrow: 1 }}>
        <ListItem sx={{ py: 0.5, pl: 0 }}>
          <Chip 
            label="Self Learning" 
            color={selectedForm.evalForm.culturalFit.growthMindset.selfLearning ? "warning" : "default"} 
            size="small"
            variant={selectedForm.evalForm.culturalFit.growthMindset.selfLearning ? "filled" : "outlined"}
            sx={{ 
              color: selectedForm.evalForm.culturalFit.growthMindset.selfLearning ? '#fff' : 'inherit',
              bgcolor: selectedForm.evalForm.culturalFit.growthMindset.selfLearning ? '' : 'rgba(255, 255, 255, 0.08)'
            }}
          />
        </ListItem>
      </List>
      
      
    </Box>
  </Grid>
  
  <Grid item xs={12} sm={4}>
    <SkillSection 
      title="Work Ethic" 
      skills={selectedForm.evalForm.culturalFit.workEthic} 
      color="warning"
    />
  </Grid>
</Grid>

         {/* Custom Questions Section */}
         <Typography variant="h6" gutterBottom color="text.primary">
           Custom Questions
         </Typography>
         <Grid container spacing={2} sx={{ mb: 3 }}>
           <QuestionsSection 
             title="Programming Questions" 
             questions={selectedForm.evalForm.customQuestions.programQuestions} 
           />
           <QuestionsSection 
             title="Theory Questions" 
             questions={selectedForm.evalForm.customQuestions.theoryQuestions} 
           />
           <QuestionsSection 
             title="Other Questions" 
             questions={selectedForm.evalForm.customQuestions.otherQuestions} 
           />
         </Grid>
         {selectedForm.evalForm.culturalFit.growthMindset.certifications.length > 0 && (
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary">Certifications:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {selectedForm.evalForm.culturalFit.growthMindset.certifications.map((cert, i) => (
              <Chip 
                key={i} 
                label={cert} 
                color="info" 
                size="small" 
                sx={{ color: '#fff' }}
              />
            ))}
          </Box>
        </Box>
      )}
      <br />
         <Button 
           variant="contained" 
           color="primary" 
           onClick={handleCloseModal} 
           sx={{ mt: 2 }}
         >
           Close
         </Button>
       </>
     )}
   </Paper>
 </Modal>
</Box>
);
}

export default EvalFormDashBoard;