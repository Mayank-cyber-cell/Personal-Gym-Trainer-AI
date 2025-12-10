import { useState } from 'react';
import { useFitness } from '@/contexts/FitnessContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressEntry } from '@/types/fitness';
import { 
  Plus,
  Scale,
  TrendingUp,
  TrendingDown,
  Flame,
  Droplets,
  Moon,
  Dumbbell,
  Calendar,
  Scan,
  Target,
  Clock
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { cn } from '@/lib/utils';

const Progress = () => {
  const { progressHistory, addProgressEntry, userProfile, workoutSessions } = useFitness();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'sessions'>('progress');
  const [newEntry, setNewEntry] = useState<Partial<ProgressEntry>>({
    weight: userProfile?.weight || 70,
    workoutsCompleted: 0,
    caloriesBurned: 0,
    waterIntake: 2,
    sleepHours: 7,
    notes: '',
  });

  const handleSubmit = () => {
    if (newEntry.weight) {
      addProgressEntry({
        date: new Date(),
        weight: newEntry.weight,
        workoutsCompleted: newEntry.workoutsCompleted || 0,
        caloriesBurned: newEntry.caloriesBurned || 0,
        waterIntake: newEntry.waterIntake || 0,
        sleepHours: newEntry.sleepHours || 0,
        notes: newEntry.notes,
      });
      setShowForm(false);
      setNewEntry({
        weight: userProfile?.weight || 70,
        workoutsCompleted: 0,
        caloriesBurned: 0,
        waterIntake: 2,
        sleepHours: 7,
        notes: '',
      });
    }
  };

  const chartData = progressHistory.map((entry, index) => ({
    name: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: entry.weight,
    workouts: entry.workoutsCompleted,
    calories: entry.caloriesBurned,
    water: entry.waterIntake,
    sleep: entry.sleepHours,
  }));

  const getWeightTrend = () => {
    if (progressHistory.length < 2) return null;
    const latest = progressHistory[progressHistory.length - 1].weight;
    const previous = progressHistory[progressHistory.length - 2].weight;
    const diff = latest - previous;
    return {
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
      value: Math.abs(diff).toFixed(1),
    };
  };

  const weightTrend = getWeightTrend();

  const totalWorkouts = progressHistory.reduce((sum, e) => sum + e.workoutsCompleted, 0);
  const totalCalories = progressHistory.reduce((sum, e) => sum + e.caloriesBurned, 0);
  const avgSleep = progressHistory.length > 0 
    ? (progressHistory.reduce((sum, e) => sum + e.sleepHours, 0) / progressHistory.length).toFixed(1)
    : 0;

  // Workout sessions stats
  const totalSessionReps = workoutSessions.reduce((sum, s) => sum + s.reps, 0);
  const avgFormScore = workoutSessions.length > 0
    ? Math.round(workoutSessions.reduce((sum, s) => sum + s.formScore, 0) / workoutSessions.length)
    : 0;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatExerciseName = (exercise: string) => {
    return exercise.charAt(0).toUpperCase() + exercise.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation />
      
      <main className="pt-20 md:pt-24 px-4 md:px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Progress Tracking</h1>
            <p className="text-muted-foreground">Monitor your fitness journey</p>
          </div>
          {activeTab === 'progress' && (
            <Button variant="hero" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Log Progress
            </Button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={activeTab === 'progress' ? 'hero' : 'outline'} 
            onClick={() => setActiveTab('progress')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Progress
          </Button>
          <Button 
            variant={activeTab === 'sessions' ? 'hero' : 'outline'} 
            onClick={() => setActiveTab('sessions')}
          >
            <Scan className="w-4 h-4 mr-2" />
            Workout Sessions ({workoutSessions.length})
          </Button>
        </div>

        {/* Log Form */}
        {showForm && (
          <div className="glass-card p-6 mb-6">
            <h2 className="font-semibold mb-4">Log Today's Progress</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={newEntry.weight}
                  onChange={(e) => setNewEntry({ ...newEntry, weight: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Workouts Completed</Label>
                <Input
                  type="number"
                  value={newEntry.workoutsCompleted}
                  onChange={(e) => setNewEntry({ ...newEntry, workoutsCompleted: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Calories Burned</Label>
                <Input
                  type="number"
                  value={newEntry.caloriesBurned}
                  onChange={(e) => setNewEntry({ ...newEntry, caloriesBurned: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Water Intake (L)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={newEntry.waterIntake}
                  onChange={(e) => setNewEntry({ ...newEntry, waterIntake: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Sleep (hours)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={newEntry.sleepHours}
                  onChange={(e) => setNewEntry({ ...newEntry, sleepHours: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Input
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="How are you feeling?"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="hero" onClick={handleSubmit}>Save Entry</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {activeTab === 'progress' ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Current Weight</span>
                </div>
                <p className="text-2xl font-bold">
                  {progressHistory.length > 0 
                    ? progressHistory[progressHistory.length - 1].weight 
                    : userProfile?.weight || '—'} kg
                </p>
                {weightTrend && (
                  <div className={cn(
                    "flex items-center gap-1 text-sm mt-1",
                    weightTrend.direction === 'down' ? "text-primary" : weightTrend.direction === 'up' ? "text-accent" : "text-muted-foreground"
                  )}>
                    {weightTrend.direction === 'down' ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : weightTrend.direction === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : null}
                    {weightTrend.value} kg
                  </div>
                )}
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="w-4 h-4 text-accent" />
                  <span className="text-sm text-muted-foreground">Total Workouts</span>
                </div>
                <p className="text-2xl font-bold">{totalWorkouts}</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">Calories Burned</span>
                </div>
                <p className="text-2xl font-bold">{totalCalories.toLocaleString()}</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-muted-foreground">Avg Sleep</span>
                </div>
                <p className="text-2xl font-bold">{avgSleep}h</p>
              </div>
            </div>

            {/* Charts */}
            {progressHistory.length > 0 ? (
              <div className="space-y-6">
                {/* Weight Chart */}
                <div className="glass-card p-6">
                  <h2 className="font-semibold mb-4">Weight Progress</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(78, 100%, 55%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(78, 100%, 55%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                        <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                        <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(220, 18%, 10%)', 
                            border: '1px solid hsl(220, 15%, 20%)',
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="hsl(78, 100%, 55%)" 
                          fillOpacity={1} 
                          fill="url(#weightGradient)" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Activity Chart */}
                <div className="glass-card p-6">
                  <h2 className="font-semibold mb-4">Activity Overview</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                        <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                        <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(220, 18%, 10%)', 
                            border: '1px solid hsl(220, 15%, 20%)',
                            borderRadius: '8px'
                          }}
                        />
                        <Line type="monotone" dataKey="workouts" stroke="hsl(78, 100%, 55%)" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="sleep" stroke="hsl(250, 80%, 60%)" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="water" stroke="hsl(200, 80%, 60%)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">Workouts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      <span className="text-sm text-muted-foreground">Sleep (h)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500" />
                      <span className="text-sm text-muted-foreground">Water (L)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Progress Logged Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your fitness journey by logging your first entry!
                </p>
                <Button variant="hero" onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Log Your First Entry
                </Button>
              </div>
            )}

            {/* History */}
            {progressHistory.length > 0 && (
              <div className="glass-card p-6 mt-6">
                <h2 className="font-semibold mb-4">Recent Entries</h2>
                <div className="space-y-3">
                  {[...progressHistory].reverse().slice(0, 5).map((entry, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground">{entry.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Scale className="w-3 h-3" />
                          {entry.weight}kg
                        </span>
                        <span className="flex items-center gap-1">
                          <Dumbbell className="w-3 h-3" />
                          {entry.workoutsCompleted}
                        </span>
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3" />
                          {entry.waterIntake}L
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Workout Sessions Tab */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Scan className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Sessions</span>
                </div>
                <p className="text-2xl font-bold">{workoutSessions.length}</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="w-4 h-4 text-accent" />
                  <span className="text-sm text-muted-foreground">Total Reps</span>
                </div>
                <p className="text-2xl font-bold">{totalSessionReps}</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Avg Form Score</span>
                </div>
                <p className="text-2xl font-bold">{avgFormScore}%</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-muted-foreground">Total Time</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatDuration(workoutSessions.reduce((sum, s) => sum + s.duration, 0))}
                </p>
              </div>
            </div>

            {/* Sessions List */}
            {workoutSessions.length > 0 ? (
              <div className="glass-card p-6">
                <h2 className="font-semibold mb-4">Workout Sessions</h2>
                <div className="space-y-3">
                  {[...workoutSessions].reverse().map((session) => (
                    <div 
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Dumbbell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{formatExerciseName(session.exercise)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">{session.reps}</p>
                          <p className="text-muted-foreground">reps</p>
                        </div>
                        <div className="text-center">
                          <p className={cn(
                            "text-lg font-bold",
                            session.formScore >= 80 ? "text-primary" : 
                            session.formScore >= 60 ? "text-yellow-500" : "text-red-500"
                          )}>{session.formScore}%</p>
                          <p className="text-muted-foreground">form</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{formatDuration(session.duration)}</p>
                          <p className="text-muted-foreground">time</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Scan className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Workout Sessions Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Complete a posture analysis session to track your reps and form scores!
                </p>
                <Button variant="hero" onClick={() => window.location.href = '/posture'}>
                  <Scan className="w-4 h-4 mr-2" />
                  Start Posture Analysis
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Progress;
