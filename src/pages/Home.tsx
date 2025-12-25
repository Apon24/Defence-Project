import { Link } from 'react-router-dom';
import { Leaf, Calculator, BookOpen, Trophy, Users, Map, TreePine, Target, BarChart3, Lightbulb, Quote, ArrowRight, Sprout, Recycle } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)',
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-6">
            <Leaf className="h-24 w-24 text-green-400 animate-pulse drop-shadow-lg" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            Eco Track Bangladesh
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8 animate-slide-up">
            Track your carbon footprint. Embrace sustainability. Build a greener Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              to="/calculator"
              className="px-8 py-4 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-soft-lg"
            >
              Calculate Your Impact
            </Link>
            <Link
              to="/quiz"
              className="px-8 py-4 bg-white text-green-600 rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-soft-lg"
            >
              Take the Quiz
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
            Why Eco Track?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calculator className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                Track Your Footprint
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Calculate your daily carbon emissions from electricity, transport, and lifestyle choices.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
              <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                Complete Challenges
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Take on daily eco-friendly challenges and build sustainable habits step by step.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                Join Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share ideas, learn from others, and be part of Bangladesh's eco movement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Our Collective Impact
          </h2>
          <p className="text-center text-emerald-100 mb-12 max-w-2xl mx-auto">
            Together, we're making a real difference for Bangladesh's environment
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-green-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TreePine className="h-7 w-7 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">10,000+</p>
              <p className="text-emerald-200 text-sm">Trees Planted</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-blue-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-7 w-7 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">50,000+</p>
              <p className="text-emerald-200 text-sm">kg CO₂ Reduced</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-yellow-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">5,000+</p>
              <p className="text-emerald-200 text-sm">Active Members</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-red-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-7 w-7 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">25,000+</p>
              <p className="text-emerald-200 text-sm">Challenges Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Start your sustainability journey in just a few simple steps
          </p>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { icon: Calculator, title: 'Calculate', desc: 'Measure your carbon footprint', color: 'green' },
              { icon: Target, title: 'Challenge', desc: 'Take on daily eco tasks', color: 'yellow' },
              { icon: BookOpen, title: 'Learn', desc: 'Take quizzes & read tips', color: 'blue' },
              { icon: Users, title: 'Connect', desc: 'Join our community', color: 'purple' },
              { icon: BarChart3, title: 'Track', desc: 'Monitor your progress', color: 'red' },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className={`bg-${step.color}-100 dark:bg-${step.color}-900 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className={`h-6 w-6 text-${step.color}-600 dark:text-${step.color}-400`} />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{index + 1}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Challenges Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                Featured Challenges
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Start with these popular eco-friendly challenges
              </p>
            </div>
            <Link
              to="/challenges"
              className="hidden md:flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105"
            >
              <span>View All</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Plastic-Free Day', difficulty: 'Easy', desc: 'Avoid using any single-use plastic for 24 hours', icon: Recycle, color: 'green' },
              { title: 'Green Commute', difficulty: 'Medium', desc: 'Use public transport, cycle, or walk to work', icon: Sprout, color: 'yellow' },
              { title: 'Zero Food Waste', difficulty: 'Hard', desc: 'Plan meals and compost all food scraps', icon: Lightbulb, color: 'red' },
            ].map((challenge, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-green-500 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-${challenge.color}-100 dark:bg-${challenge.color}-900 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <challenge.icon className={`h-7 w-7 text-${challenge.color}-600 dark:text-${challenge.color}-400`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{challenge.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{challenge.desc}</p>
                <Link
                  to="/challenges"
                  className="flex items-center space-x-2 text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 transition-colors"
                >
                  <span>Start Challenge</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="md:hidden mt-6 text-center">
            <Link
              to="/challenges"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
            >
              <span>View All Challenges</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Comprehensive tools to track, learn, and improve your environmental impact
          </p>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Calculator, title: 'Carbon Calculator', link: '/calculator', color: 'green' },
              { icon: BookOpen, title: 'Eco Quizzes', link: '/quiz', color: 'blue' },
              { icon: Trophy, title: 'Challenges', link: '/challenges', color: 'yellow' },
              { icon: Map, title: 'Eco Map', link: '/map', color: 'red' },
              { icon: TreePine, title: 'Tree Planting', link: '/map', color: 'emerald' },
              { icon: BarChart3, title: 'Dashboard', link: '/dashboard', color: 'purple' },
            ].map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className={`bg-${feature.color}-100 dark:bg-${feature.color}-900 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm">{feature.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
            Success Stories
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Hear from our community members making a difference
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Eco Track helped me reduce my carbon footprint by 40% in just 3 months. The daily challenges made sustainability fun!",
                name: "Rahim Ahmed",
                location: "Dhaka",
                saved: "120 kg CO₂"
              },
              {
                quote: "The tree planting feature connects me with real impact. I've virtually planted 50 trees in the Sundarbans buffer zone.",
                name: "Fatima Begum",
                location: "Chittagong",
                saved: "85 kg CO₂"
              },
              {
                quote: "As a student, the quizzes taught me so much about our environment. Now I teach my family sustainable practices.",
                name: "Karim Hassan",
                location: "Sylhet",
                saved: "95 kg CO₂"
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
              >
                <Quote className="h-10 w-10 text-green-200 dark:text-green-800 absolute top-4 left-4" />
                <div className="pt-8">
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{testimonial.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-green-700 dark:text-green-300">{testimonial.saved}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-red-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Bangladesh Needs Your Action
              </h2>
              <p className="text-green-50 text-lg mb-6">
                As one of the world's most climate-vulnerable nations, Bangladesh faces rising sea levels,
                extreme weather, and environmental challenges. Every small action counts.
              </p>
              <ul className="space-y-3 text-green-50">
                <li className="flex items-start">
                  <span className="text-2xl mr-2">🌊</span>
                  <span>Coastal communities at risk from rising waters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-2">♻️</span>
                  <span>Plastic pollution threatening our rivers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-2">🌡️</span>
                  <span>Increasing temperatures affecting agriculture</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/blog"
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-soft hover:shadow-soft-lg group"
              >
                <BookOpen className="h-12 w-12 text-green-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-gray-800 dark:text-white">Read Stories</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Learn about local issues</p>
              </Link>

              <Link
                to="/map"
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-soft hover:shadow-soft-lg group"
              >
                <Map className="h-12 w-12 text-red-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-gray-800 dark:text-white">Explore Map</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Find eco spots nearby</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Start Your Eco Journey Today
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of Bangladeshis making a difference, one sustainable choice at a time.
          </p>
          <Link
            to="/challenges"
            className="inline-block px-10 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-soft-lg"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};
