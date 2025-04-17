import Lead from '../models/lead.model.js';  // Utilisation de `import`

// @desc    Get leads assigned to manager
// @route   GET /api/managers/leads
// @access  Private/Manager
export const getManagerLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ manager: req.user._id });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead status or notes
// @route   PATCH /api/managers/leads/:id
// @access  Private/Manager
export const updateLeadStatus = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check if lead is assigned to current manager
    if (lead.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    // Update status if provided
    if (req.body.status) {
      lead.status = req.body.status;
    }

    // Add note if provided
    if (req.body.note) {
      lead.notes.push(req.body.note);
    }

    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
