
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDown, Check, Upload, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CertGen Pro
        </div>
        <div className="flex items-center gap-6">
          <Link to="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
            Pricing
          </Link>
          <Button variant="outline" className="border-slate-300">Sign In</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Check className="h-4 w-4" />
            Trusted by 10,000+ organizations
          </div>
          
          <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight animate-fade-in">
            Generate thousands of
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              professional certificates
            </span>
            in minutes
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            Upload your template, import your data, customize positioning with our intuitive editor, 
            and generate beautiful certificates for all your participants instantly.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in">
            <Link to="/generator">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto">
                Start Creating Certificates
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-slate-300">
              Watch Demo
            </Button>
          </div>
          
          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Easy Upload</h3>
              <p className="text-slate-600">
                Simply upload your PDF certificate template and Excel data file to get started.
              </p>
            </Card>
            
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Visual Editor</h3>
              <p className="text-slate-600">
                Drag, drop, and position text fields, signatures, and seals with pixel-perfect precision.
              </p>
            </Card>
            
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Bulk Download</h3>
              <p className="text-slate-600">
                Generate and download individual certificates or get them all in a compressed folder.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              From template to finished certificates in just a few simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Upload Template", desc: "Upload your PDF certificate template" },
              { step: "02", title: "Import Data", desc: "Upload Excel file with participant data" },
              { step: "03", title: "Customize", desc: "Position text, signatures, and seals" },
              { step: "04", title: "Generate", desc: "Download individual or bulk certificates" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to create professional certificates?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations who trust CertGen Pro for their certificate needs.
          </p>
          <Link to="/generator">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 h-auto bg-white text-slate-900 hover:bg-slate-100">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            CertGen Pro
          </div>
          <p className="text-slate-400">© 2024 CertGen Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
