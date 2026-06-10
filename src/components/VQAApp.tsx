import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, Brain, Image as ImageIcon, MessageSquare, Sparkles, Camera, Eye } from 'lucide-react';
import heroNeuralBg from '@/assets/hero-neural-bg.jpg';
import { supabase } from '@/integrations/supabase/client';

interface VQAResponse {
  answer: string;
  confidence: number;
  processingTime: number;
}

const VQAApp = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<VQAResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processVQA = async () => {
    if (!selectedImage || !question.trim()) {
      toast({
        title: "Missing inputs",
        description: "Please upload an image and enter a question",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      toast({
        title: 'Analyzing with AI...',
        description: 'Processing your question with advanced vision model',
      });

      const { data, error } = await supabase.functions.invoke('visual-qa', {
        body: { 
          image: imagePreview,
          question: question.trim()
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data.error) {
        toast({
          title: "Analysis failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setAnswer(data);
      
      toast({
        title: 'Analysis complete!',
        description: 'AI has analyzed your image',
      });
    } catch (error) {
      console.error('VQA Error:', error);
      toast({
        title: "Processing failed",
        description: "Unable to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Neural Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroNeuralBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/95 to-background/90" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Brain className="w-16 h-16 text-primary neural-glow" />
              <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            Visual Question Answering
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered system that understands images and answers questions about their content using state-of-the-art neural networks.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Image Upload */}
          <Card className="p-6 bg-gradient-card border-primary/20 shadow-neural">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Upload Image</Label>
              </div>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  isDragOver 
                    ? 'border-primary bg-primary/10 shadow-glow' 
                    : imagePreview 
                      ? 'border-accent' 
                      : 'border-muted hover:border-primary/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-lg font-medium">Drop your image here</p>
                      <p className="text-muted-foreground">or click to browse</p>
                    </div>
                    <Button
                      variant="neural"
                      onClick={() => fileInputRef.current?.click()}
                      className="neural-glow"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Select Image
                    </Button>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </Card>

          {/* Right Column - Question & Answer */}
          <Card className="p-6 bg-gradient-card border-primary/20 shadow-neural">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Ask a Question</Label>
              </div>
              
              <div className="space-y-4">
                <Textarea
                  placeholder="What do you see in this image? Describe the colors, objects, people, or ask specific questions..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-24 bg-background/50 border-primary/20 focus:border-primary transition-all"
                />
                
                <Button
                  onClick={processVQA}
                  disabled={!selectedImage || !question.trim() || isProcessing}
                  className="w-full"
                  variant="glow"
                >
                  {isProcessing ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>

              {/* Answer Display */}
              {answer && (
                <Card className="p-4 bg-gradient-accent border-accent/30 shadow-accent-glow animate-in fade-in-50 slide-in-from-bottom-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-accent-foreground font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI Response
                      </Label>
                      <div className="text-xs text-accent-foreground/80">
                        {answer.processingTime}ms
                      </div>
                    </div>
                    <p className="text-accent-foreground">{answer.answer}</p>
                    <div className="flex justify-between text-xs text-accent-foreground/80">
                      <span>Confidence: {Math.round(answer.confidence * 100)}%</span>
                      <span>Model: Gemini Vision</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center bg-gradient-card border-primary/20 hover:shadow-glow transition-all duration-300 float">
            <Brain className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Neural Networks</h3>
            <p className="text-sm text-muted-foreground">Advanced CNN and Transformer architectures for image understanding</p>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-card border-primary/20 hover:shadow-accent-glow transition-all duration-300 float" style={{ animationDelay: '0.2s' }}>
            <Eye className="w-8 h-8 mx-auto mb-4 text-accent" />
            <h3 className="font-semibold mb-2">Visual Analysis</h3>
            <p className="text-sm text-muted-foreground">Multi-modal fusion of visual features and natural language</p>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-card border-primary/20 hover:shadow-glow transition-all duration-300 float" style={{ animationDelay: '0.4s' }}>
            <MessageSquare className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Natural Language</h3>
            <p className="text-sm text-muted-foreground">Sophisticated question understanding and answer generation</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VQAApp;