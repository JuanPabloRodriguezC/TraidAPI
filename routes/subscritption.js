// routes/bots.js
import { Router } from 'express';

export default function(pool){
  const router = Router();

  // GET subscription
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM subscription WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Subscription type not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Database error:', err.message, '\nStack:', err.stack);
      res.status(500).json({ 
        error: 'Failed to fetch bot',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  });


  // PUT update bot
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, rank } = req.body;
      const result = await pool.query(
        'UPDATE subscription SET name = $1 WHERE id = $3 RETURNING *',
        [name, rank, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Sub not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update sub' });
    }
  });

  // DELETE bot
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM subscription WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Sub not found' });
      }
      res.json({ message: 'Subscription deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete sub' });
    }
  });

  return router;
}

