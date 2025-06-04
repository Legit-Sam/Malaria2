// Expanded malaria symptoms dataset
const malariaSymptoms = [
    'fever', 'high fever', 'intermittent fever', 'chills', 'shivering', 'sweats', 'night sweats', 
    'headache', 'migraine', 'severe headache', 'nausea', 'vomiting', 'fatigue', 'extreme tiredness',
    'muscle pain', 'muscle aches', 'joint pain', 'joint aches', 'body aches', 'general weakness', 
    'loss of appetite', 'anorexia', 'abdominal pain', 'stomach pain', 'diarrhea', 'loose stools', 
    'cough', 'dry cough', 'rapid breathing', 'shortness of breath', 'confusion', 'disorientation', 
    'dizziness', 'lightheadedness', 'jaundice', 'yellowing of skin', 'yellowing of eyes', 
    'pale skin', 'paleness', 'dark urine', 'tea-colored urine', 'enlarged spleen', 'splenomegaly', 
    'anemia', 'low energy', 'malaise', 'sweating episodes', 'irritability', 'seizures', 
    'convulsions', 'sweating profusely', 'chest pain', 'dehydration', 'poor concentration'
];

// Drug recommendations
const malariaDrugs = [
    {
        name: 'Artemether-Lumefantrine',
        description: 'A combination therapy taken twice daily for 3 days. Effective for uncomplicated malaria. Follow dosage instructions.'
    },
    {
        name: 'Chloroquine',
        description: 'Used in areas where malaria is sensitive to this drug. Taken weekly for prevention or daily for treatment.'
    },
    {
        name: 'Paracetamol',
        description: 'For fever and pain relief. Take as needed, following dosage instructions.'
    },
    {
        name: 'Doxycycline',
        description: 'Used for malaria prophylaxis or in combination therapy. Take as prescribed by a healthcare provider.'
    },
    {
        name: 'Quinine',
        description: 'Used for severe malaria cases under medical supervision. Follow prescribed dosage.'
    }
];

const symptomaticDrugs = [
    {
        name: 'Paracetamol',
        description: 'For fever and pain relief. Take as needed, following dosage instructions.'
    },
    {
        name: 'Ibuprofen',
        description: 'For pain and inflammation. Follow dosage instructions and avoid if allergic.'
    },
    {
        name: 'Oral Rehydration Salts',
        description: 'To prevent dehydration from diarrhea or vomiting. Mix with clean water as directed.'
    },
    {
        name: 'Antihistamine',
        description: 'For relief from mild allergic symptoms or itching. Follow dosage instructions.'
    }
];

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.getElementById('theme-body');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    sunIcon.classList.toggle('opacity-0', !isDark);
    sunIcon.classList.toggle('opacity-100', isDark);
    moonIcon.classList.toggle('opacity-0', isDark);
    moonIcon.classList.toggle('opacity-100', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    sunIcon.classList.remove('opacity-0');
    sunIcon.classList.add('opacity-100');
    moonIcon.classList.remove('opacity-100');
    moonIcon.classList.add('opacity-0');
} else {
    sunIcon.classList.remove('opacity-100');
    sunIcon.classList.add('opacity-0');
    moonIcon.classList.remove('opacity-0');
    moonIcon.classList.add('opacity-100');
}

// Form handling
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const symptomsInput = document.getElementById('symptoms');
const loadingDiv = document.getElementById('loading');
const resultsDiv = document.getElementById('results');
const diagnosisText = document.getElementById('diagnosis');
const recommendationText = document.getElementById('recommendation');
const medicationsList = document.getElementById('medications');

function resetForm() {
    symptomsInput.value = '';
    resultsDiv.classList.add('hidden');
    diagnosisText.textContent = '';
    recommendationText.textContent = '';
    medicationsList.innerHTML = '';
    // Reset loading steps
    ['step1', 'step2', 'step3', 'step4'].forEach(step => {
        const stepElement = document.getElementById(step);
        stepElement.querySelector('svg').classList.add('hidden');
    });
}

submitBtn.addEventListener('click', () => {
    if (!symptomsInput.value.trim()) {
        alert('Please describe your symptoms.');
        return;
    }

    // Clear previous results
    resetForm();

    // Show loading animation
    loadingDiv.classList.remove('hidden');
    submitBtn.disabled = true;
    resetBtn.disabled = true;

    // Loading steps animation
    const steps = ['step1', 'step2', 'step3', 'step4'];
    let delay = 0;

    steps.forEach((step, index) => {
        setTimeout(() => {
            const stepElement = document.getElementById(step);
            stepElement.querySelector('svg').classList.remove('hidden');
            if (index === steps.length - 1) {
                setTimeout(() => {
                    loadingDiv.classList.add('fade-out');
                    setTimeout(() => {
                        loadingDiv.classList.add('hidden');
                        loadingDiv.classList.remove('fade-out');
                        showResults();
                        submitBtn.disabled = false;
                        resetBtn.disabled = false;
                    }, 500);
                }, 1000);
            }
        }, delay);
        delay += 1200; // Slightly slower for dramatic effect
    });
});

resetBtn.addEventListener('click', resetForm);

function showResults() {
    const userInput = symptomsInput.value.toLowerCase().split(/[\s,]+/);
    let matchCount = 0;

    // Check for matches
    malariaSymptoms.forEach(symptom => {
        if (userInput.some(word => symptom.includes(word) || word.includes(symptom))) {
            matchCount++;
        }
    });

    resultsDiv.classList.remove('hidden');
    medicationsList.innerHTML = '';

    // Threshold: at least 4 matching symptoms to diagnose malaria
    if (matchCount >= 4) {
        diagnosisText.textContent = 'Based on your symptoms, there is a high likelihood of malaria.';
        recommendationText.textContent = 'Please visit a pharmacy or healthcare provider immediately for a confirmatory test and treatment.';
        malariaDrugs.forEach(drug => {
            const li = document.createElement('li');
            li.textContent = `${drug.name}: ${drug.description}`;
            li.classList.add('py-1.5', 'hover:text-blue-500', 'transition-colors', 'duration-200');
            medicationsList.appendChild(li);
        });
    } else {
        diagnosisText.textContent = 'Your symptoms do not strongly indicate malaria.';
        recommendationText.textContent = 'For a definitive diagnosis, please consult a pharmacy or healthcare provider.';
        symptomaticDrugs.forEach(drug => {
            const li = document.createElement('li');
            li.textContent = `${drug.name}: ${drug.description}`;
            li.classList.add('py-1.5', 'hover:text-blue-400', 'transition-colors', 'duration-200');
            medicationsList.appendChild(li);
        });
    }
}