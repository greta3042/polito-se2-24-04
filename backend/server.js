const express = require('express');
const path = require('path');
const app = express();

// Serve React Project 1
app.use('/project1', express.static(path.join(__dirname, 'frontend/project1/build')));

// Serve React Project 2
app.use('/project2', express.static(path.join(__dirname, 'frontend/project2/build')));

// Serve React Project 3
app.use('/project3', express.static(path.join(__dirname, 'frontend/project3/build')));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
  if (req.path.startsWith('/project1')) {
    res.sendFile(path.join(__dirname, 'project1/build', 'index.html'));
  } else if (req.path.startsWith('/project2')) {
    res.sendFile(path.join(__dirname, 'project2/build', 'index.html'));
  } else if (req.path.startsWith('/project3')) {
    res.sendFile(path.join(__dirname, 'project3/build', 'index.html'));
  } else {
    res.status(404).send('Not Found');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const corsOptions = {
  origin: [`http://localhost:${PORT}`], // Aggiungi tutte le origini autorizzate
  credentials: true // Permetti l'invio di cookie nelle richieste CORS
};

app.use(cors(corsOptions));
initRoutes(app)
if (!module.parent) {
  app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
  });
}