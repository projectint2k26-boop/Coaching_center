
window.showPage = function (pageId) {
  if (pageId === 'apply' && !window.currentUser) {
    openAuthModal();
    const err = document.getElementById('auth-error');
    err.textContent = "Please login first to apply.";
    err.style.display = 'block';
    return;
  }
  // Hide all sections
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.remove('active');
  });

  // Show target section
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
};
const courseMap = {
  viruthunagar: ['TNPSC Group 1 Exam', 'TNPSC Group 2 Exam'],
  madurai: ['UPSC Civil Services Exam', 'SSC CGL Exam'],
  sivakasi: ['SI Police Exam', 'Banking Exam (IBPS/SBI)']
};

function showCourses(branch) {
  showPage('courses-' + branch);
}

function hideCourses() {
  showPage('branches');
}

function updateCourseDropdown() {
  const branch = document.getElementById('f-branch').value;
  const sel = document.getElementById('f-course');
  sel.innerHTML = '';
  if (!branch) {
    sel.innerHTML = '<option>-- Select branch first --</option>';
    return;
  }
  sel.innerHTML = '<option value="">-- Choose a course --</option>';
  courseMap[branch].forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    sel.appendChild(opt);
  });
}

window.prefillCourse = function (branch, course) {
  if (!window.currentUser) {
    openAuthModal();
    const err = document.getElementById('auth-error');
    err.textContent = "Please login first to apply.";
    err.style.display = 'block';
    return;
  }
  const branchKey = branch.toLowerCase();
  const branchSel = document.getElementById('f-branch');
  if (branchSel) {
    branchSel.value = branchKey;
    updateCourseDropdown();
    setTimeout(() => {
      const courseSel = document.getElementById('f-course');
      Array.from(courseSel.options).forEach(o => {
        if (o.text.toLowerCase().includes(course.toLowerCase().split(' ')[0].toLowerCase())) {
          courseSel.value = o.value;
        }
      });
    }, 50);
  }
}

window.submitForm = async function () {
  const name = document.getElementById('f-name').value.trim();
  const mobile = document.getElementById('f-mobile').value.trim();
  const branch = document.getElementById('f-branch').value;
  const course = document.getElementById('f-course').value;
  if (!name || !mobile || !branch || !course) {
    alert('Please fill in all required fields (Name, Mobile, Branch, Course).');
    return;
  }

  const btn = document.querySelector('.form-submit');
  btn.textContent = 'Submitting...';
  btn.disabled = true;

  try {
    if (window.addDoc && window.db) {
      await window.addDoc(window.collection(window.db, "applications"), {
        name, mobile, branch, course,
        userId: window.currentUser ? window.currentUser.uid : null,
        email: window.currentUser ? window.currentUser.email : null,
        timestamp: new Date()
      });
    }

    document.getElementById('apply-form').style.display = 'none';
    const msg = document.getElementById('success-msg');
    msg.style.display = 'block';
    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (e) {
    alert("Error submitting application: " + e.message);
    btn.textContent = 'Submit Application';
    btn.disabled = false;
  }
}

window.viewCourseDetails = function (btnElement, branch, courseName) {
  const card = btnElement.closest('.course-card');
  const badge = card.querySelector('.course-exam-badge').outerHTML;
  const title = card.querySelector('h3').innerHTML;
  const desc = card.querySelector('.course-card-header p').innerHTML;
  const details = card.querySelector('.course-details').innerHTML;
  const offer = card.querySelector('.offer-strip').innerHTML;

  document.getElementById('modal-badge-container').innerHTML = badge;
  document.getElementById('modal-title').innerHTML = title;
  document.getElementById('modal-desc').innerHTML = desc;
  document.getElementById('modal-details').innerHTML = details;
  document.getElementById('modal-offer').innerHTML = offer;

  const applyBtn = document.getElementById('modal-apply-btn');
  applyBtn.onclick = function () {
    closeCourseModal();
    showPage('apply');
    prefillCourse(branch, courseName);
  };

  document.getElementById('course-overlay').classList.add('active');
};

window.closeCourseModal = function () {
  document.getElementById('course-overlay').classList.remove('active');
};

window.toggleDropdown = function () {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  }
};
// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
  const profile = document.getElementById('user-profile');
  const dropdown = document.getElementById('user-dropdown');
  if (profile && dropdown && !profile.contains(event.target)) {
    dropdown.style.display = 'none';
  }
});
