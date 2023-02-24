const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add', (req, res,) => { 
    res.render('links/add');
});

router.post('/add', async (req, res,) => {
    const { title, url, description} = req.body;
    const newLink = {
        title,
        url,
        description,
    };
    //console.log(newLink);
    try { 
        await pool.query('INSERT INTO links set ?', [newLink]);
        req.flash('success', 'Link added');
        res.redirect('/links')}
    catch(err){
        console.log(err);
        res.send('Carajo')
    }
});

router.get('/', async (req, res,) => {
    
    const links = await pool.query('SELECT * FROM links');
    console.log(links);
    res.render('links/list', { links });
});
    
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Link deleted');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit',{links: links[0]});
});

router.post('/edit/:id', async (req, res,) => {
    const {id} = req.params;
    const { title, url, description} = req.body;
    const newLink = {
        title,
        url,
        description,
    };

    try { 
        await pool.query('UPDATE links set ? where id = ?', [newLink, id]);
        req.flash('success', 'Link updated');
        res.redirect('/links')}
    catch(err){
        console.log(err);
        res.send('Carajo')
    }
});



module.exports = router;

