import { Radar, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';

export default function RadarChart({ scores, companyReqs }) {
  const data = Object.entries(scores).map(([skill, value]) => ({
    skill,
    you: value,
    target: companyReqs ? companyReqs[skill] || 8 : 8,
  }));

  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer>
        <ReRadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#ebe5f5" />
          <PolarAngleAxis dataKey="skill" stroke="#9890aa" tick={{ fontSize: 12, fill: '#5c5478' }} />
          <Radar name="Your Skills" dataKey="you" stroke="#6c47ff" fill="#6c47ff" fillOpacity={0.15} strokeWidth={2} />
          <Radar name="Company Req" dataKey="target" stroke="#e84393" fillOpacity={0} strokeDasharray="5 5" strokeWidth={1.5} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#5c5478' }} />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
