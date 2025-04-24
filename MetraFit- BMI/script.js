const metricBtn = document.getElementById('metric');
        const imperialBtn = document.getElementById('imperial');
        const maleBtn = document.getElementById('male');
        const femaleBtn = document.getElementById('female');
        const metricForm = document.getElementById('metric-form');
        const imperialForm = document.getElementById('imperial-form');
        const calculateBtn = document.getElementById('calculate-btn');
        const result = document.getElementById('result');
        const bmiValue = document.getElementById('bmi-value');
        const bmiCategory = document.getElementById('bmi-category');
        const progressIndicator = document.getElementById('progress-indicator');
        const tipsList = document.getElementById('tips-list');
        const foodList = document.getElementById('food-list');
        const exerciseList = document.getElementById('exercise-list');
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        let currentUnit = 'metric';
        let currentGender = 'male';
        
        // Input elements
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');
        const feetInput = document.getElementById('feet');
        const inchesInput = document.getElementById('inches');
        const poundsInput = document.getElementById('pounds');
        
        // Toggle between metric and imperial units
        metricBtn.addEventListener('click', () => {
            metricBtn.classList.add('active');
            imperialBtn.classList.remove('active');
            metricForm.style.display = 'block';
            imperialForm.style.display = 'none';
            currentUnit = 'metric';
        });
        
        imperialBtn.addEventListener('click', () => {
            imperialBtn.classList.add('active');
            metricBtn.classList.remove('active');
            imperialForm.style.display = 'block';
            metricForm.style.display = 'none';
            currentUnit = 'imperial';
        });
        
        // Toggle between male and female
        maleBtn.addEventListener('click', () => {
            maleBtn.classList.add('active');
            femaleBtn.classList.remove('active');
            currentGender = 'male';
            result.className = 'result male';
            if (result.classList.contains('show')) {
                calculateBMI(); // Recalculate to update tips
            }
        });
        
        femaleBtn.addEventListener('click', () => {
            femaleBtn.classList.add('active');
            maleBtn.classList.remove('active');
            currentGender = 'female';
            result.className = 'result female';
            if (result.classList.contains('show')) {
                calculateBMI(); // Recalculate to update tips
            }
        });
        
        // Tab functionality
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Calculate BMI when button is clicked
        calculateBtn.addEventListener('click', calculateBMI);
        
        // Live calculation as user types
        heightInput.addEventListener('input', debounce(calculateBMI, 500));
        weightInput.addEventListener('input', debounce(calculateBMI, 500));
        feetInput.addEventListener('input', debounce(calculateBMI, 500));
        inchesInput.addEventListener('input', debounce(calculateBMI, 500));
        poundsInput.addEventListener('input', debounce(calculateBMI, 500));
        
        // Debounce function to limit the rate of function calls
        function debounce(func, delay) {
            let timer;
            return function() {
                clearTimeout(timer);
                timer = setTimeout(func, delay);
            };
        }
        
        // Calculate BMI function
        function calculateBMI() {
            let bmi;
            let hasAllInputs = false;
            
            if (currentUnit === 'metric') {
                const height = parseFloat(heightInput.value);
                const weight = parseFloat(weightInput.value);
                
                if (height && weight) {
                    // Convert height from cm to meters
                    const heightInMeters = height / 100;
                    bmi = weight / (heightInMeters * heightInMeters);
                    hasAllInputs = true;
                }
            } else {
                const feet = parseFloat(feetInput.value) || 0;
                const inches = parseFloat(inchesInput.value) || 0;
                const pounds = parseFloat(poundsInput.value);
                
                if ((feet || inches) && pounds) {
                    // Convert feet and inches to inches
                    const totalInches = feet * 12 + inches;
                    bmi = (pounds * 703) / (totalInches * totalInches);
                    hasAllInputs = true;
                }
            }
            
            if (hasAllInputs) {
                displayResult(bmi);
            }
        }
        
        // Display the result
        function displayResult(bmi) {
            bmi = Math.round(bmi * 10) / 10; // Round to 1 decimal place
            
            bmiValue.textContent = bmi;
            
            let category = '';
            let progressWidth = '';
            let categoryClass = '';
            
            if (bmi < 18.5) {
                category = 'Underweight';
                categoryClass = 'underweight';
                progressWidth = (bmi / 40) * 100; // Arbitrary max value of 40 for scaling
            } else if (bmi >= 18.5 && bmi < 25) {
                category = 'Normal Weight';
                categoryClass = 'normal';
                progressWidth = (bmi / 40) * 100;
            } else if (bmi >= 25 && bmi < 30) {
                category = 'Overweight';
                categoryClass = 'overweight';
                progressWidth = (bmi / 40) * 100;
            } else {
                category = 'Obese';
                categoryClass = 'obese';
                progressWidth = Math.min((bmi / 40) * 100, 100); // Cap at 100%
            }
            
            bmiCategory.textContent = category;
            bmiCategory.className = 'bmi-category ' + categoryClass;
            
            // Apply gender-specific styling and content
            result.className = 'result show ' + currentGender;
            
            // Update health tips, food suggestions, and exercise plans based on gender and BMI category
            updateHealthTips(category);
            updateFoodSuggestions(category);
            updateExercisePlans(category);
            
            // Animate progress bar
            progressIndicator.style.width = `${progressWidth}%`;
            
            // Add animation to BMI value
            bmiValue.style.animation = 'none';
            bmiValue.offsetHeight; // Trigger reflow
            bmiValue.style.animation = 'fadeIn 0.5s';
        }
        
        function updateHealthTips(category) {
            let tips = [];
            
            if (currentGender === 'male') {
                if (category === 'Underweight') {
                    tips = [
                        'Consider consulting with a healthcare provider about healthy weight gain strategies',
                        'Focus on strength training to build muscle mass',
                        'Aim for protein intake of approximately 1.6-2.2g per kg of body weight',
                        'Get adequate rest (7-9 hours) to support muscle recovery and growth',
                        'Regular health check-ups to monitor nutritional deficiencies'
                    ];
                } else if (category === 'Normal Weight') {
                    tips = [
                        'Maintain regular exercise combining both cardio and strength training',
                        'Continue balanced nutrition with adequate protein (about 1.2-1.6g per kg of body weight)',
                        'Monitor blood pressure and cholesterol levels regularly',
                        'Aim for at least a 30-minute brisk walk daily',
                        'Practice stress management techniques like meditation or deep breathing'
                    ];
                } else if (category === 'Overweight') {
                    tips = [
                        'Focus on gradual weight loss of 1-2 pounds per week',
                        'Reduce refined carbohydrate intake and increase protein consumption',
                        'Incorporate HIIT (High-Intensity Interval Training) for efficient fat burning',
                        'Monitor blood pressure regularly as men are more prone to hypertension',
                        'Consider intermittent fasting approaches after consulting with a healthcare provider'
                    ];
                } else {
                    tips = [
                        'Seek guidance from healthcare professionals for a personalized weight management plan',
                        'Begin with low-impact exercises to protect joints (swimming, cycling)',
                        'Focus on reducing abdominal fat which poses higher health risks for men',
                        'Get screened for sleep apnea, which is more common in men with obesity',
                        'Monitor for signs of metabolic syndrome and type 2 diabetes',
                        'Consider joining a men\'s support group for motivation and accountability'
                    ];
                }
            } else {
                // Female-specific tips
                if (category === 'Underweight') {
                    tips = [
                        'Consult with a healthcare provider to rule out hormonal imbalances',
                        'Focus on weight training to build lean muscle while maintaining femininity',
                        'Ensure adequate calcium and vitamin D intake for bone health',
                        'Monitor iron levels as women are more prone to anemia',
                        'Consider tracking your basal metabolic rate (BMR) to ensure adequate calorie intake'
                    ];
                } else if (category === 'Normal Weight') {
                    tips = [
                        'Continue balanced nutrition with focus on iron, calcium, and folate',
                        'Incorporate strength training to prevent bone density loss',
                        'Practice stress management as cortisol can affect weight distribution',
                        'Consider hormone-friendly exercises if experiencing PMS or menopause symptoms',
                        'Regular preventive healthcare screenings appropriate for your age'
                    ];
                } else if (category === 'Overweight') {
                    tips = [
                        'Focus on gradual weight loss with a balanced approach',
                        'Monitor vitamin D levels which can affect metabolism and mood',
                        'Consider weight training to boost metabolism through muscle building',
                        'Be aware of hormonal influences on weight, especially during menopause',
                        'Consider food journaling to identify emotional eating triggers'
                    ];
                } else {
                    tips = [
                        'Consult with healthcare professionals about weight-related hormonal impacts',
                        'Begin with gentle exercises like walking, swimming, or yoga',
                        'Be screened for PCOS if experiencing irregular cycles',
                        'Focus on stress management as cortisol can contribute to abdominal fat',
                        'Consider joining women-focused support groups for motivation',
                        'Monitor for signs of insulin resistance which affects women differently'
                    ];
                }
            }
            
            // Display health tips
            tipsList.innerHTML = '';
            tips.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                tipsList.appendChild(li);
            });
        }
        
        function updateFoodSuggestions(category) {
            let foods = [];
            
            if (currentGender === 'male') {
                if (category === 'Underweight') {
                    foods = [
                        'Protein shakes with whole milk, protein powder, banana, and peanut butter',
                        'Nutrient-dense foods like avocados, nuts, and olive oil',
                        'Lean protein sources such as chicken breast, lean beef, and salmon',
                        'Complex carbohydrates like sweet potatoes, brown rice, and whole grain pasta',
                        'Greek yogurt with honey and nuts for protein and healthy fats',
                        'Trail mix with dried fruits and various nuts for on-the-go calories'
                    ];
                } else if (category === 'Normal Weight') {
                    foods = [
                        'Balanced portions of lean proteins, complex carbs, and healthy fats',
                        'Fatty fish like salmon and mackerel rich in omega-3 fatty acids',
                        'Eggs and lean meats to support muscle maintenance',
                        'Plenty of colorful vegetables for micronutrients and antioxidants',
                        'Whole grains like quinoa, oats, and brown rice',
                        'Nuts and seeds for healthy fats and micronutrients'
                    ];
                } else if (category === 'Overweight') {
                    foods = [
                        'High protein foods like chicken breast, turkey, and cottage cheese',
                        'Fiber-rich foods to increase satiety (beans, lentils, broccoli)',
                        'Replace refined carbs with vegetables or small portions of whole grains',
                        'Healthy fats in moderation (avocados, nuts, olive oil)',
                        'Low-sugar fruits like berries, apples, and pears',
                        'Green tea for metabolism support and antioxidants'
                    ];
                } else {
                    foods = [
                        'Focus on portion control using smaller plates',
                        'Lean proteins: chicken breast, fish, egg whites, and plant proteins',
                        'Non-starchy vegetables in abundance (leafy greens, bell peppers, cauliflower)',
                        'Limited healthy fats from sources like avocado and olive oil',
                        'Limited complex carbohydrates like sweet potatoes or quinoa',
                        'Increase water intake and herbal teas to stay hydrated',
                        'Consider meal prepping to avoid fast food and processed options'
                    ];
                }
            } else {
                // Female-specific food suggestions
                if (category === 'Underweight') {
                    foods = [
                        'Nutrient-dense smoothies with full-fat yogurt, fruits, and nut butters',
                        'Healthy carbohydrates like oats, sweet potatoes, and whole grains',
                        'Protein sources like eggs, chicken, tofu, and legumes',
                        'Iron-rich foods such as spinach, lentils, and lean red meat',
                        'Calcium-rich foods like yogurt, cheese, and fortified plant milks',
                        'Healthy fats from avocados, nuts, seeds, and olive oil'
                    ];
                } else if (category === 'Normal Weight') {
                    foods = [
                        'Iron-rich foods like spinach, legumes, and lean red meat',
                        'Calcium-rich foods like dairy or fortified plant alternatives',
                        'Folate-rich foods like leafy greens, citrus, and beans',
                        'Balanced portions of lean proteins, complex carbs, and healthy fats',
                        'Colorful fruits and vegetables for antioxidants and phytonutrients',
                        'Whole grains like quinoa, buckwheat, and brown rice'
                    ];
                } else if (category === 'Overweight') {
                    foods = [
                        'Protein-rich foods like Greek yogurt, eggs, and lean poultry',
                        'Fiber-rich foods such as vegetables, fruits, and whole grains',
                        'Healthy fats from sources like nuts, seeds, and olive oil',
                        'Limit refined sugars and processed foods',
                        'Incorporate foods rich in vitamin D and calcium',
                        'Green tea and herbal teas for metabolism support'
                    ];
                } else {
                    foods = [
                        'Consult with healthcare professionals about weight-related hormonal impacts',
                        'Focus on nutrient-dense, low-calorie foods like leafy greens and vegetables',
                        'Include lean proteins such as fish, chicken, and legumes',
                        'Limit intake of simple carbohydrates and sugars',
                        'Stay hydrated and consider herbal teas',
                        'Meal prep to avoid processed and fast foods'
                    ];
                }
            }
            
            // Display food suggestions
            foodList.innerHTML = '';
            foods.forEach(food => {
                const li = document.createElement('li');
                li.textContent = food;
                foodList.appendChild(li);
            });
        }
        
        function updateExercisePlans(category) {
            let exercises = [];
            
            if (currentGender === 'male') {
                if (category === 'Underweight') {
                    exercises = [
                        'Strength training 3-4 times a week focusing on compound movements',
                        'Include progressive overload to build muscle mass',
                        'Adequate rest days to allow muscle recovery',
                        'Incorporate moderate cardio for cardiovascular health',
                        'Stretching and mobility exercises to prevent injury'
                    ];
                } else if (category === 'Normal Weight') {
                    exercises = [
                        'Balanced mix of cardio and strength training 4-5 times a week',
                        'Include HIIT sessions for fat burning and endurance',
                        'Core strengthening exercises',
                        'Flexibility and mobility work',
                        'Active recovery days with light activities like walking or yoga'
                    ];
                } else if (category === 'Overweight') {
                    exercises = [
                        'Low-impact cardio such as swimming or cycling 4-5 times a week',
                        'Strength training focusing on large muscle groups',
                        'Incorporate HIIT cautiously with professional guidance',
                        'Flexibility exercises to improve range of motion',
                        'Gradual increase in exercise intensity'
                    ];
                } else {
                    exercises = [
                        'Consult with healthcare professionals before starting exercise',
                        'Begin with low-impact activities like walking or water aerobics',
                        'Focus on joint-friendly strength training',
                        'Incorporate flexibility and balance exercises',
                        'Monitor for any discomfort or pain during exercise'
                    ];
                }
            } else {
                // Female-specific exercise plans
                if (category === 'Underweight') {
                    exercises = [
                        'Strength training 2-3 times a week focusing on lean muscle building',
                        'Incorporate bodyweight exercises and resistance bands',
                        'Include cardio sessions for cardiovascular health',
                        'Flexibility and balance exercises',
                        'Adequate rest and recovery'
                    ];
                } else if (category === 'Normal Weight') {
                    exercises = [
                        'Combination of cardio, strength, and flexibility training 4-5 times a week',
                        'Incorporate Pilates or yoga for core strength and flexibility',
                        'Moderate intensity strength training',
                        'HIIT sessions 1-2 times a week',
                        'Active recovery days with light activities'
                    ];
                } else if (category === 'Overweight') {
                    exercises = [
                        'Low-impact cardio such as swimming, walking, or cycling 4-5 times a week',
                        'Strength training focusing on major muscle groups',
                        'Incorporate flexibility and balance exercises',
                        'Gradual increase in exercise intensity',
                        'Consider group classes for motivation'
                    ];
                } else {
                    exercises = [
                        'Consult healthcare professionals before starting an exercise program',
                        'Begin with gentle activities like walking or water aerobics',
                        'Focus on flexibility, balance, and low-impact strength training',
                        'Incorporate stress-reducing exercises like yoga or meditation',
                        'Monitor for any health concerns during exercise'
                    ];
                }
            }
            
            // Display exercise plans
            exerciseList.innerHTML = '';
            exercises.forEach(exercise => {
                const li = document.createElement('li');
                li.textContent = exercise;
                exerciseList.appendChild(li);
            });
        }