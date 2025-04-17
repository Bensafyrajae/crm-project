import User from '../models/user.model.js';
import Lead from '../models/lead.model.js';

// @desc    Get dashboard stats
// @route   GET /api/employer/dashboard-stats
// @access  Private/Employer
export const getDashboardStats = async (req, res) => {
  try {
    const inProgressCount = await Lead.countDocuments({
      status: { $in: ['PENDING', 'IN_PROGRESS'] },
    });
    
    const completedCount = await Lead.countDocuments({ status: 'COMPLETED' });
    
    const canceledCount = await Lead.countDocuments({ status: 'CANCELED' });

    res.json({
      inProgressCount,
      completedCount,
      canceledCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all managers
// @route   GET /api/employer/managers
// @access  Private/Employer
export const getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('-password');
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a manager
// @route   POST /api/employer/managers
// @access  Private/Employer
export const createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const manager = await User.create({
      name,
      email,
      password,
      role: 'manager',
    });

    if (manager) {
      res.status(201).json({
        _id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid manager data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a manager
// @route   PUT /api/employer/managers/:managerId
// @access  Private/Employer
export const updateManager = async (req, res) => {
  try {
    const manager = await User.findById(req.params.managerId);

    if (manager) {
      manager.name = req.body.name || manager.name;
      manager.email = req.body.email || manager.email;
      
      if (req.body.password) {
        manager.password = req.body.password;
      }

      const updatedManager = await manager.save();

      res.json({
        _id: updatedManager._id,
        name: updatedManager.name,
        email: updatedManager.email,
        role: updatedManager.role,
      });
    } else {
      res.status(404).json({ message: 'Manager not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a manager
// @route   DELETE /api/employer/managers/:managerId
// @access  Private/Employer
export const deleteManager = async (req, res) => {
  try {
    const manager = await User.findById(req.params.managerId);

    if (manager) {
      // Check if manager has any leads assigned
      const leadsCount = await Lead.countDocuments({ manager: manager._id });
      
      if (leadsCount > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete manager with assigned leads. Reassign leads first.' 
        });
      }
      
      await manager.remove();
      res.json({ message: 'Manager removed' });
    } else {
      res.status(404).json({ message: 'Manager not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all leads
// @route   GET /api/employer/leads
// @access  Private/Employer
export const getLeads = async (req, res) => {
  try {
    const { managerId, status } = req.query;
    
    // Build filter object
    const filter = {};
    if (managerId) filter.manager = managerId;
    if (status) filter.status = status;
    
    const leads = await Lead.find(filter).populate('manager', 'name email');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a lead
// @route   POST /api/employer/leads
// @access  Private/Employer
export const createLead = async (req, res) => {
  try {
    const { contactName, contactEmail, companyName, status, managerId } = req.body;

    // Verify manager exists
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== 'manager') {
      return res.status(400).json({ message: 'Invalid manager' });
    }

    const lead = await Lead.create({
      contactName,
      contactEmail,
      companyName,
      status: status || 'PENDING',
      manager: managerId,
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a lead
// @route   PUT /api/employer/leads/:leadId
// @access  Private/Employer
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);

    if (lead) {
      lead.contactName = req.body.contactName || lead.contactName;
      lead.contactEmail = req.body.contactEmail || lead.contactEmail;
      lead.companyName = req.body.companyName || lead.companyName;
      lead.status = req.body.status || lead.status;
      
      // If manager is being updated, verify new manager exists
      if (req.body.managerId) {
        const manager = await User.findById(req.body.managerId);
        if (!manager || manager.role !== 'manager') {
          return res.status(400).json({ message: 'Invalid manager' });
        }
        lead.manager = req.body.managerId;
      }

      if (req.body.notes) {
        lead.notes = req.body.notes;
      }

      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/employer/leads/:leadId
// @access  Private/Employer
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);

    if (lead) {
      await lead.remove();
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
