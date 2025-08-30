const { Op } = require('sequelize');

// All item operations use req.shopDb for multi-tenant
module.exports = {
  // GET /api/items
  async getAll(req, res, next) {
    try {
      const items = await req.shopDb.models.Item.findAll();
      res.json(items);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/items/:id
  async getOne(req, res, next) {
    try {
      const item = await req.shopDb.models.Item.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/items
  async create(req, res, next) {
    try {
      const { sku, name, unit, category, brand } = req.body;
      let image = null;
      if (req.file) image = req.file.buffer;
      const item = await req.shopDb.models.Item.create({ sku, name, unit, category, brand, image });
      // Exclude image buffer from response
      const { image: _image, ...itemData } = item.get({ plain: true });
      res.status(201).json(itemData);
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/items/:id
  async update(req, res, next) {
    try {
      const { sku, name, unit, category, brand } = req.body;
      let image = undefined;
      if (req.file) image = req.file.buffer;
      const item = await req.shopDb.models.Item.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      await item.update({ sku, name, unit, category, brand, ...(image !== undefined && { image }) });
      // Exclude image buffer from response
      const { image: _image, ...itemData } = item.get({ plain: true });
      res.json(itemData);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/items/:id
  async remove(req, res, next) {
    try {
      const item = await req.shopDb.models.Item.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      await item.destroy();
      res.json({ message: 'Item deleted' });
    } catch (err) {
      next(err);
    }
  }
};
