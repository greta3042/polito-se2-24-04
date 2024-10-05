import express from 'express';
import ServiceDao from './dao/service.mjs';

const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

const serviceDao = new ServiceDao();

// Server React Project 1
app.use('/project1', express.static(path.join(__dirname, 'frontend/project1/build')));

// Server React Project 2
app.use('/project2', express.static(path.join(__dirname, 'frontend/project2/build')));

// Server React Project 3
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

/* Get ticket API */
app.get('/api/newTicket', async(req, res) => {
  try{
    const result = await serviceDao.newTicket(req.body.serviceName);
    if(result.error)
        res.status(404).json(result);
    else
      res.json(result);
  }catch(err){
    res.status(500).end();
  }
});
