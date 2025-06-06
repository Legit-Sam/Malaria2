// Malaria symptoms dataset
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

// Non-medical keywords to filter out
const nonMedicalKeywords = [
    'car', 'phone', 'computer', 'game', 'weather', 'food', 'hungry', 'thirsty', 'tired',
    'work', 'school', 'movie', 'music', 'happy', 'sad', 'angry', 'job', 'travel', 'money',
    'shopping', 'clothes', 'internet', 'tv', 'book', 'sport', 'party', 'friend', 'traffic',
    'study', 'exam', 'laptop', 'broken', 'fixed', 'sleepy', 'bored', 'excited', 'homework',
    'vacation', 'holiday', 'dance', 'art', 'project', 'meeting', 'news', 'fashion', 'gym'
];

// Drug recommendations
const malariaDrugs = [
    { name: 'Artemether-Lumefantrine', description: 'A combination therapy taken twice daily for 3 days. Effective for uncomplicated malaria. Follow dosage instructions.' },
    { name: 'Chloroquine', description: 'Used in areas where malaria is sensitive to this drug. Taken weekly for prevention or daily for treatment.' },
    { name: 'Paracetamol', description: 'For fever and pain relief. Take as needed, following dosage instructions.' },
    { name: 'Doxycycline', description: 'Used for malaria prophylaxis or in combination therapy. Take as prescribed by a healthcare provider.' },
    { name: 'Quinine', description: 'Used for severe malaria cases under medical supervision. Follow prescribed dosage.' },
    { name: 'Mefloquine', description: 'Used for malaria prevention and treatment. Take as prescribed by your doctor.' },
    { name: 'Primaquine', description: 'Used to prevent relapse in certain types of malaria. Only take under medical supervision.' },
    { name: 'Atovaquone-Proguanil', description: 'Combination tablet for malaria prevention and treatment. Take as directed.' },
    { name: 'Sulphadoxine-Pyrimethamine', description: 'Used in some regions for malaria treatment. Follow medical advice.' },
    // More malaria drugs
    { name: 'Halofantrine', description: 'Used for resistant malaria strains. Only under medical supervision.' },
    { name: 'Artesunate', description: 'Used for severe malaria, especially in hospitals. Follow doctor\'s instructions.' }
];

const symptomaticDrugs = [
    { name: 'Paracetamol', description: 'For fever and pain relief. Take as needed, following dosage instructions.' },
    { name: 'Ibuprofen', description: 'For pain and inflammation. Follow dosage instructions and avoid if allergic.' },
    { name: 'Oral Rehydration Salts', description: 'To prevent dehydration from diarrhea or vomiting. Mix with clean water as directed.' },
    { name: 'Antihistamine', description: 'For relief from mild allergic symptoms or itching. Follow dosage instructions.' },
    { name: 'Loperamide', description: 'For relief from diarrhea. Use only as directed and not for children under 12.' },
    { name: 'Domperidone', description: 'For nausea and vomiting. Use as prescribed.' },
    { name: 'Vitamin C', description: 'Supports immune function. Take as a supplement if recommended.' },
    { name: 'Zinc Supplement', description: 'May help reduce duration of diarrhea. Use as directed.' },
    // More symptomatic drugs
    { name: 'Cetirizine', description: 'For allergy relief. Take as directed.' },
    { name: 'Promethazine', description: 'For nausea and allergy symptoms. Use as prescribed.' },
    { name: 'ORS Sachets', description: 'For oral rehydration. Dissolve in water and drink as directed.' }
];

// DOM elements
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

const symptomsInput = document.getElementById('symptoms');
const suggestionsDiv = document.getElementById('suggestions');
const selectedSymptomsDiv = document.getElementById('selected-symptoms');
const doneBtn = document.getElementById('done-btn');
const symptomsSection = document.getElementById('symptoms-section');
const symptomsCollapsed = document.getElementById('symptoms-collapsed');
const symptomsSummary = document.getElementById('symptoms-summary');
const descriptionSection = document.getElementById('description-section');
const descriptionInput = document.getElementById('description');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const loadingDiv = document.getElementById('loading');
const resultsDiv = document.getElementById('results');
const diagnosisText = document.getElementById('diagnosis');
const recommendationText = document.getElementById('recommendation');
const medicationsList = document.getElementById('medications');

// State
let selectedSymptoms = [];

// Theme toggle (Tailwind dark mode fix)
const html = document.documentElement;
function updateThemeIcons() {
    const isDark = html.classList.contains('dark');
    sunIcon.classList.toggle('opacity-0', !isDark);
    sunIcon.classList.toggle('opacity-100', isDark);
    moonIcon.classList.toggle('opacity-0', isDark);
    moonIcon.classList.toggle('opacity-100', !isDark);
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    updateThemeIcons();
});

if (localStorage.getItem('theme') === 'dark') {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}
updateThemeIcons();

// Real-time symptom search
symptomsInput.addEventListener('input', () => {
    const query = symptomsInput.value.toLowerCase().trim();
    suggestionsDiv.innerHTML = '';
    suggestionsDiv.classList.add('hidden');

    if (query) {
        // Filter out non-medical keywords
        if (nonMedicalKeywords.some(keyword => query.includes(keyword))) {
            return;
        }
        const matches = malariaSymptoms.filter(symptom =>
            symptom.toLowerCase().includes(query) && !selectedSymptoms.includes(symptom)
        );
        if (matches.length > 0) {
            suggestionsDiv.classList.remove('hidden');
            matches.forEach(symptom => {
                const div = document.createElement('div');
                div.className = 'p-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-100 text-sm';
                div.textContent = symptom;
                div.addEventListener('click', () => addSymptom(symptom));
                suggestionsDiv.appendChild(div);
            });
        }
    }
});

// Add symptom
function addSymptom(symptom) {
    if (!selectedSymptoms.includes(symptom)) {
        selectedSymptoms.push(symptom);
        updateSelectedSymptoms();
        symptomsInput.value = '';
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.add('hidden');
    }
}

// Remove symptom
function removeSymptom(symptom) {
    selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
    updateSelectedSymptoms();
}

// Update selected symptoms display
function updateSelectedSymptoms() {
    selectedSymptomsDiv.innerHTML = '';
    selectedSymptoms.forEach(symptom => {
        const span = document.createElement('span');
        span.className = 'inline-flex items-center bg-blue-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-full text-sm mr-2 mb-2';
        span.innerHTML = `
            ${symptom}
            <i class="fas fa-times ml-2 cursor-pointer text-red-600 hover:text-red-800" data-symptom="${symptom}"></i>
        `;
        selectedSymptomsDiv.appendChild(span);
    });

    document.querySelectorAll('.fa-times').forEach(icon => {
        icon.addEventListener('click', () => removeSymptom(icon.dataset.symptom));
    });
}

// Done button
doneBtn.addEventListener('click', () => {
    if (selectedSymptoms.length === 0) {
        alert('Please add at least one symptom.');
        return;
    }
    symptomsSection.classList.add('hidden');
    symptomsCollapsed.classList.remove('hidden');
    symptomsSummary.textContent = `Symptoms: ${selectedSymptoms.join(', ')}`;
    descriptionSection.classList.remove('hidden');
});

// Reopen symptoms section
symptomsCollapsed.addEventListener('click', () => {
    symptomsSection.classList.remove('hidden');
    symptomsCollapsed.classList.add('hidden');
    descriptionSection.classList.add('hidden');
});

// Reset form
function resetForm() {
    symptomsInput.value = '';
    selectedSymptoms = [];
    updateSelectedSymptoms();
    suggestionsDiv.innerHTML = '';
    suggestionsDiv.classList.add('hidden');
    symptomsSection.classList.remove('hidden');
    symptomsCollapsed.classList.add('hidden');
    descriptionSection.classList.add('hidden');
    descriptionInput.value = '';
    resultsDiv.classList.add('hidden');
    diagnosisText.textContent = '';
    recommendationText.textContent = '';
    medicationsList.innerHTML = '';
    ['step1', 'step2', 'step3', 'step4'].forEach(step => {
        document.getElementById(step).querySelector('svg').classList.add('hidden');
    });
}

// Submit form
submitBtn.addEventListener('click', () => {
    if (selectedSymptoms.length === 0) {
        alert('Please add at least one symptom.');
        return;
    }
    loadingDiv.classList.remove('hidden');
    submitBtn.disabled = true;
    resetBtn.disabled = true;

    const steps = ['step1', 'step2', 'step3', 'step4'];
    let delay = 0;

    steps.forEach((step, index) => {
        setTimeout(() => {
            document.getElementById(step).querySelector('svg').classList.remove('hidden');
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
        delay += 1200;
    });
});

// Reset button
resetBtn.addEventListener('click', resetForm);

// Show results
function showResults() {
    const matchCount = selectedSymptoms.length;
    const symptomsList = selectedSymptoms.join(', ') || 'none';

    resultsDiv.classList.remove('hidden');
    medicationsList.innerHTML = '';

    if (matchCount >= 4) {
        diagnosisText.textContent = `Based on your symptoms: ${symptomsList}, there is a high likelihood of malaria.`;
        recommendationText.textContent = 'Please visit a pharmacy or healthcare provider immediately for a confirmatory test and treatment.';
        malariaDrugs.forEach(drug => {
            const li = document.createElement('li');
            li.textContent = `${drug.name}: ${drug.description}`;
            li.classList.add('py-1.5', 'hover:text-blue-800', 'transition-colors', 'duration-200');
            medicationsList.appendChild(li);
        });
    } else {
        diagnosisText.textContent = `Based on your symptoms: ${symptomsList}, your symptoms do not strongly indicate malaria.`;
        recommendationText.textContent = 'For a definitive diagnosis, please consult a healthcare provider.';
        symptomaticDrugs.forEach(drug => {
            const li = document.createElement('li');
            li.textContent = `${drug.name}: ${drug.description}`;
            li.classList.add('py-1.5', 'hover:text-blue-600', 'transition-colors', 'duration-200');
            medicationsList.appendChild(li);
        });
    }
}